from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random
import json
import psutil
import socket
from typing import List, Dict

app = FastAPI(title="NetMind AI API", version="1.0.0")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "NetMind AI API", "version": "1.0.0"}

# ----- REAL NETWORK INTERFACES -----
def get_network_interfaces():
    interfaces = []
    net_io = psutil.net_io_counters(pernic=True)
    addrs = psutil.net_if_addrs()
    stats = psutil.net_if_stats()
    
    idx = 1
    for name, addrs_list in addrs.items():
        ip = ''
        for addr in addrs_list:
            if addr.family == socket.AF_INET:
                ip = addr.address
                break
        speed = stats[name].speed if name in stats else 0
        bytes_sent = net_io[name].bytes_sent if name in net_io else 0
        bytes_recv = net_io[name].bytes_recv if name in net_io else 0
        
        if ip and speed > 0:
            status = "online"
            if speed < 100:
                status = "warning"
        else:
            status = "offline"
        
        interfaces.append({
            "id": idx,
            "name": name,
            "ip": ip,
            "status": status,
            "speed_mbps": speed,
            "bytes_sent": bytes_sent,
            "bytes_recv": bytes_recv,
            "real": True
        })
        idx += 1
    
    # Fallback if psutil fails
    if not interfaces:
        interfaces = [
            {"id": 1, "name": "Wi-Fi", "ip": "192.168.1.1", "status": "online", "speed_mbps": 99, "bytes_sent": 0, "bytes_recv": 0, "real": False},
            {"id": 2, "name": "Ethernet", "ip": "192.168.1.2", "status": "online", "speed_mbps": 1000, "bytes_sent": 0, "bytes_recv": 0, "real": False},
            {"id": 3, "name": "Local Area Connection", "ip": "192.168.137.1", "status": "online", "speed_mbps": 150, "bytes_sent": 0, "bytes_recv": 0, "real": False},
            {"id": 4, "name": "Bluetooth", "ip": "", "status": "offline", "speed_mbps": 0, "bytes_sent": 0, "bytes_recv": 0, "real": False},
            {"id": 5, "name": "VirtualBox Host-Only", "ip": "192.168.56.1", "status": "online", "speed_mbps": 100, "bytes_sent": 0, "bytes_recv": 0, "real": False},
        ]
    return interfaces

# Cache devices
devices = get_network_interfaces()

# ----- API ENDPOINTS -----
@app.get("/devices")
async def get_devices():
    global devices
    devices = get_network_interfaces()
    return devices

@app.get("/ai/recommend")
async def ai_recommend():
    global devices
    devices = get_network_interfaces()
    online = [d for d in devices if d["status"] == "online" and d["speed_mbps"] > 0]
    if not online:
        return {"recommendation": "No active interfaces", "reason": "Check your network connection", "action": "none"}
    best = max(online, key=lambda x: x["speed_mbps"])
    worst = min(online, key=lambda x: x["speed_mbps"])
    if best["speed_mbps"] > worst["speed_mbps"] * 2:
        return {
            "recommendation": f"Switch from {worst['name']} to {best['name']}",
            "reason": f"{best['name']} is {best['speed_mbps']}Mbps vs {worst['name']} is {worst['speed_mbps']}Mbps",
            "action": "switch"
        }
    else:
        return {
            "recommendation": f"{best['name']} is optimal",
            "reason": f"All interfaces have similar speeds, {best['name']} is fastest at {best['speed_mbps']}Mbps",
            "action": "none"
        }

@app.post("/heal/{device_id}")
async def heal_device(device_id: int):
    global devices
    for device in devices:
        if device["id"] == device_id:
            if device["status"] != "online":
                device["status"] = "online"
                device["speed_mbps"] = random.randint(50, 200)
                return {"status": "success", "message": f"{device['name']} healed successfully!"}
            return {"status": "info", "message": f"{device['name']} is already healthy."}
    return {"status": "error", "message": "Device not found"}

@app.post("/simulate/failure/{device_id}")
async def simulate_failure(device_id: int):
    global devices
    for device in devices:
        if device["id"] == device_id:
            device["status"] = "offline"
            device["speed_mbps"] = 0
            return {"status": "success", "message": f"{device['name']} is now offline."}
    return {"status": "error", "message": "Device not found"}

# ----- WEBSOCKET -----
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            global devices
            devices = get_network_interfaces()
            await websocket.send_text(json.dumps(devices))
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        print("Client disconnected")
