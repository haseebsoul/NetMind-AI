# NetMind AI

NetMind AI is a React + Vite operator console backed by FastAPI. It provides a public product landing page, authenticated workspace, live local network-adapter telemetry, persistent activity history, and safe simulation workflows.

## Project structure

- `frontend/` — React 18, Vite, React Router, Recharts and Framer Motion.
- `backend/app/main.py` — FastAPI service, JWT authentication, SQLAlchemy persistence, psutil adapter discovery and WebSocket telemetry.
- `backend/tests/` — API and authentication tests.

## Run locally

### 1. Backend

Python 3.10+ recommended.

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
# Optional: copy .env.example to .env and set values in your shell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API creates a local SQLite database on first start. In development it seeds the bootstrap administrator from environment variables (defaults: `haseeb` / `1234`). Change these credentials and set a strong `NETMIND_SECRET_KEY` before exposing the service.

### 2. Frontend

```bash
cd frontend
npm install
# optional: create .env with VITE_API_URL=http://localhost:8000
npm run dev
```

Open http://localhost:5173. API docs are at http://127.0.0.1:8000/docs.

## API

- `POST /auth/register` — create a standard user account.
- `POST /auth/login` — OAuth2 password form; returns a JWT.
- `GET /auth/me` — authenticated identity.
- `GET /devices` — current OS network interfaces and byte counters.
- `GET /ai/recommend` — transparent rule-based link-speed observation.
- `POST /heal/{id}` — records a recovery request; does not alter OS adapters.
- `POST /simulate/failure/{id}` — dashboard-only offline simulation.
- `POST /simulate/reset/{id}` — clear a simulation override.
- `GET /api/activity`, `GET /api/reports/summary` — persisted event history and summary.
- `GET /admin/users` — administrator-only user listing.
- `WS /ws?token=<JWT>` — authenticated device telemetry stream (2-second interval).

## Safety and operational boundaries

Network adapter telemetry is read from the host running the backend. The dashboard's simulation endpoints only affect an in-memory display override and never disable or reconfigure a physical interface. Recovery requests are audit events, not privileged repair operations. The recommendation endpoint uses reported adapter link speed; it is not an internet speed test or a machine-learning model. Threats and alerts are operational event signals, not verified intrusion detection.

## Production checklist

- Set `ENVIRONMENT=production`, a cryptographically random `NETMIND_SECRET_KEY`, and non-default bootstrap credentials.
- Restrict `CORS_ORIGINS` to the deployed frontend origin.
- Use PostgreSQL via `DATABASE_URL` for multi-worker or production deployments.
- Terminate TLS at a trusted reverse proxy; use HTTPS/WSS.
- Add rate limiting, account recovery, password policy and a managed secrets store before public multi-tenant deployment.
- Run tests with `cd backend && pytest`; build frontend with `cd frontend && npm ci && npm run build`.

## Important

This project is a local network operations dashboard, not a certified security product. It does not perform packet inspection, attack detection, or autonomous hardware remediation.
