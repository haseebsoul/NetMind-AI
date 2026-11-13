from __future__ import annotations

import asyncio
import json
import logging
import os
import socket
import time
from collections import deque
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import jwt
import psutil
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pwdlib import PasswordHash
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import Boolean, DateTime, Integer, String, Text, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

APP_DIR = Path(__file__).resolve().parent
load_dotenv(APP_DIR.parent / '.env')
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{APP_DIR / 'netmind.db'}")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
SECRET_KEY = os.getenv("NETMIND_SECRET_KEY", "dev-only-change-this-secret-before-deployment")
if ENVIRONMENT == "production" and SECRET_KEY == "dev-only-change-this-secret-before-deployment":
    raise RuntimeError("NETMIND_SECRET_KEY must be set to a strong random value in production")
ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = int(os.getenv("ACCESS_TOKEN_MINUTES", "720"))
password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger("netmind")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(512))
    role: Mapped[str] = mapped_column(String(20), default="user")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Activity(Base):
    __tablename__ = "activity"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    actor: Mapped[str] = mapped_column(String(80), default="system")
    event: Mapped[str] = mapped_column(String(80))
    message: Mapped[str] = mapped_column(Text)
    severity: Mapped[str] = mapped_column(String(20), default="info")


class RegisterInput(BaseModel):
    username: str = Field(min_length=3, max_length=80, pattern=r"^[a-zA-Z0-9_.-]+$")
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=10, max_length=128)


class UserOutput(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: str
    role: str
    is_active: bool
    created_at: datetime


class TokenOutput(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class PasswordChangeInput(BaseModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=10, max_length=128)


class HealInput(BaseModel):
    note: str | None = Field(default=None, max_length=300)


class ConnectionManager:
    def __init__(self) -> None:
        self.connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections.add(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self.connections.discard(websocket)

    async def broadcast(self, payload: dict[str, Any]) -> None:
        dead: list[WebSocket] = []
        for ws in list(self.connections):
            try:
                await ws.send_json(payload)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)


manager = ConnectionManager()
simulation_overrides: dict[str, dict[str, Any]] = {}
last_io: dict[str, tuple[float, int, int]] = {}
recent_samples: deque[dict[str, Any]] = deque(maxlen=60)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def log_event(db: Session, event: str, message: str, actor: str = "system", severity: str = "info") -> None:
    db.add(Activity(event=event, message=message, actor=actor, severity=severity))
    db.commit()


def make_token(user: User) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": str(user.id), "username": user.username, "role": user.role,
               "iat": now, "exp": now + timedelta(minutes=ACCESS_TOKEN_MINUTES)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    unauthorized = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired access token",
                                 headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub", ""))
    except (jwt.InvalidTokenError, TypeError, ValueError):
        raise unauthorized
    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise unauthorized
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Administrator access required")
    return user


def network_interfaces() -> list[dict[str, Any]]:
    addrs = psutil.net_if_addrs()
    stats = psutil.net_if_stats()
    counters = psutil.net_io_counters(pernic=True)
    now = time.monotonic()
    output = []
    for index, name in enumerate(sorted(set(addrs) | set(stats) | set(counters)), start=1):
        stat = stats.get(name)
        counter = counters.get(name)
        ip = next((a.address for a in addrs.get(name, []) if a.family == socket.AF_INET), "")
        ipv6 = next((a.address for a in addrs.get(name, []) if a.family == socket.AF_INET6), "")
        sent = counter.bytes_sent if counter else 0
        recv = counter.bytes_recv if counter else 0
        previous = last_io.get(name)
        tx_rate = rx_rate = 0.0
        if previous:
            elapsed = max(now - previous[0], 0.001)
            tx_rate = max(0, sent - previous[1]) / elapsed
            rx_rate = max(0, recv - previous[2]) / elapsed
        last_io[name] = (now, sent, recv)
        override = simulation_overrides.get(name)
        is_up = bool(stat.isup) if stat else False
        status_value = "online" if is_up else "offline"
        if override and override.get("status"):
            status_value = override["status"]
        output.append({
            "id": index, "name": name, "ip": ip, "ipv6": ipv6,
            "status": status_value, "is_up": is_up,
            "speed_mbps": int(stat.speed or 0) if stat else 0,
            "mtu": int(stat.mtu or 0) if stat else 0,
            "bytes_sent": int(sent), "bytes_recv": int(recv),
            "tx_bytes_per_sec": round(tx_rate, 2), "rx_bytes_per_sec": round(rx_rate, 2),
            "real": True, "simulated": bool(override)
        })
    return output


def seed_admin() -> None:
    username = os.getenv("NETMIND_BOOTSTRAP_USERNAME", "haseeb" if ENVIRONMENT == "development" else "")
    password = os.getenv("NETMIND_BOOTSTRAP_PASSWORD", "1234" if ENVIRONMENT == "development" else "")
    if not username or not password:
        return
    with SessionLocal() as db:
        existing = db.scalar(select(User).where(User.username == username))
        if not existing:
            db.add(User(username=username, email=os.getenv("NETMIND_BOOTSTRAP_EMAIL", "admin@localhost"),
                        hashed_password=password_hash.hash(password), role="admin"))
            db.commit()
            logger.warning("Created bootstrap administrator '%s'. Change its password before deployment.", username)


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(engine)
    seed_admin()
    yield


app = FastAPI(title="NetMind AI API", version="2.0.0", lifespan=lifespan)
origins = [x.strip() for x in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True,
                   allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"], allow_headers=["Authorization", "Content-Type"])


@app.get("/")
async def root():
    return {"name": "NetMind AI API", "version": app.version, "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.post("/auth/register", response_model=UserOutput, status_code=201)
def register(payload: RegisterInput, db: Session = Depends(get_db)):
    if db.scalar(select(User).where((User.username == payload.username) | (User.email == payload.email))):
        raise HTTPException(status_code=409, detail="Username or email already registered")
    user = User(username=payload.username, email=payload.email.lower(), hashed_password=password_hash.hash(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    log_event(db, "user.registered", f"Account created for {user.username}", actor=user.username)
    return user


@app.post("/auth/login", response_model=TokenOutput)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.username == form.username))
    if not user or not password_hash.verify(form.password, user.hashed_password) or not user.is_active:
        raise HTTPException(status_code=401, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    return TokenOutput(access_token=make_token(user), expires_in=ACCESS_TOKEN_MINUTES * 60)


@app.get("/auth/me", response_model=UserOutput)
def me(user: User = Depends(get_current_user)):
    return user


@app.post("/auth/change-password")
def change_password(payload: PasswordChangeInput, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not password_hash.verify(payload.current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    user.hashed_password = password_hash.hash(payload.new_password)
    db.add(user)
    db.commit()
    log_event(db, "user.password_changed", f"Password changed for {user.username}", actor=user.username)
    return {"status": "success", "message": "Password updated successfully."}


@app.get("/devices")
async def get_devices(_: User = Depends(get_current_user)):
    return network_interfaces()


@app.get("/ai/recommend")
async def ai_recommend(_: User = Depends(get_current_user)):
    devices = network_interfaces()
    online = [d for d in devices if d["status"] == "online"]
    if not online:
        return {"recommendation": "No active network interfaces", "reason": "Check adapter state and physical connectivity.", "action": "inspect"}
    fastest = max(online, key=lambda d: d["speed_mbps"])
    return {"recommendation": f"{fastest['name']} is the highest-link-speed active adapter",
            "reason": f"Reported link speed: {fastest['speed_mbps']} Mbps. This is link capacity, not measured internet throughput.",
            "action": "none"}


@app.post("/heal/{device_id}")
async def heal_device(device_id: int, payload: HealInput | None = None,
                      user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    devices = network_interfaces()
    device = next((d for d in devices if d["id"] == device_id), None)
    if not device:
        raise HTTPException(status_code=404, detail="Adapter not found")
    # This endpoint records an operator action; it deliberately does not toggle OS adapters.
    simulation_overrides.pop(device["name"], None)
    log_event(db, "adapter.recovery_requested",
              f"Recovery requested for {device['name']}. No privileged OS-level adapter changes were performed.",
              actor=user.username, severity="warning")
    await manager.broadcast({"type": "activity", "event": "adapter.recovery_requested", "device": device["name"]})
    return {"status": "accepted", "message": "Recovery request recorded. Adapter state is read from the operating system; no hardware or OS settings were changed.", "device": device["name"]}


@app.post("/simulate/failure/{device_id}")
async def simulate_failure(device_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    devices = network_interfaces()
    device = next((d for d in devices if d["id"] == device_id), None)
    if not device:
        raise HTTPException(status_code=404, detail="Adapter not found")
    simulation_overrides[device["name"]] = {"status": "offline"}
    log_event(db, "simulation.adapter_offline", f"Simulated offline state for {device['name']}; physical adapter was not disabled.",
              actor=user.username, severity="warning")
    await manager.broadcast({"type": "activity", "event": "simulation.adapter_offline", "device": device["name"]})
    return {"status": "success", "message": f"Simulation enabled for {device['name']}. Physical adapter was not changed.", "device": device["name"]}


@app.post("/simulate/reset/{device_id}")
async def reset_simulation(device_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    devices = network_interfaces()
    device = next((d for d in devices if d["id"] == device_id), None)
    if not device:
        raise HTTPException(status_code=404, detail="Adapter not found")
    simulation_overrides.pop(device["name"], None)
    log_event(db, "simulation.reset", f"Simulation override cleared for {device['name']}", actor=user.username)
    return {"status": "success", "message": f"Simulation cleared for {device['name']}."}


@app.get("/api/activity")
def activity(limit: int = 50, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    limit = min(max(limit, 1), 200)
    rows = db.scalars(select(Activity).where((Activity.actor == user.username) | (Activity.actor == "system")).order_by(Activity.timestamp.desc()).limit(limit)).all()
    return [{"id": r.id, "timestamp": r.timestamp.isoformat(), "actor": r.actor, "event": r.event,
             "message": r.message, "severity": r.severity} for r in rows]


@app.get("/api/reports/summary")
def reports(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    devices = network_interfaces()
    rows = db.scalars(select(Activity).where((Activity.actor == user.username) | (Activity.actor == "system")).order_by(Activity.timestamp.desc()).limit(500)).all()
    return {"generated_at": datetime.now(timezone.utc).isoformat(), "adapter_count": len(devices),
            "online": sum(d["status"] == "online" for d in devices),
            "offline": sum(d["status"] == "offline" for d in devices),
            "events_total": len(rows), "simulated_adapters": sum(d["simulated"] for d in devices)}


@app.get("/api/rewards")
def rewards(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(Activity).where(Activity.actor == user.username)).all()
    recoveries = sum(r.event == "adapter.recovery_requested" for r in rows)
    simulations = sum(r.event == "simulation.adapter_offline" for r in rows)
    points = recoveries * 10 + simulations * 5
    level = points // 100 + 1
    return {"points": points, "level": level, "points_to_next_level": 100 - (points % 100),
            "recovery_requests": recoveries, "simulation_tests": simulations,
            "basis": "10 points per logged recovery request and 5 points per logged simulation test. This is a transparent activity counter, not an AI score or performance certification."}

@app.get("/admin/users", response_model=list[UserOutput])
def admin_users(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return db.scalars(select(User).order_by(User.created_at.desc())).all()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    token = websocket.query_params.get("token", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub", ""))
        with SessionLocal() as db:
            user = db.get(User, user_id)
            if not user or not user.is_active:
                raise ValueError("inactive user")
    except Exception:
        await websocket.close(code=1008)
        return
    await manager.connect(websocket)
    try:
        while True:
            devices = network_interfaces()
            await websocket.send_json({"type": "devices", "timestamp": datetime.now(timezone.utc).isoformat(), "devices": devices})
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
        logger.exception("WebSocket stream failed")
