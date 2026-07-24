import psutil
import socket
import random
import time
from typing import List, Dict

class NetworkMonitor:
    def __init__(self):
        self.active_interface = None
        self.interfaces = []
        self.switch_history = []
        self.signal_strengths = {}
        self.scan_interval = 3

    def scan_interfaces(self) -> List[Dict]:
        \"\"\"Get real interfaces from psutil and add simulated signal strength.\"\"\"
        interfaces = []
        net_io = psutil.net_io_counters(pernic=True)
        addrs = psutil.net_if_addrs()
        stats = psutil.net_if_stats()

        for name, addrs_list in addrs.items():
            ip = ''
            for addr in addrs_list:
                if addr.family == socket.AF_INET:
                    ip = addr.address
                    break
            speed = stats[name].speed if name in stats else 0
            bytes_sent = net_io[name].bytes_sent if name in net_io else 0

            if ip and speed > 0:
                status = "online"
            else:
                status = "offline"

            if name not in self.signal_strengths:
                self.signal_strengths[name] = random.randint(50, 90)
            signal = self.signal_strengths[name]

            interfaces.append({
                "name": name,
                "ip": ip,
                "status": status,
                "speed_mbps": speed,
                "signal": signal,
                "bytes_sent": bytes_sent,
                "real": True
            })

        interfaces.sort(key=lambda x: (
            x["name"] == self.active_interface,
            x["status"] == "online",
            x["status"] == "warning"
        ), reverse=True)

        self.interfaces = interfaces
        return interfaces

    def update_signals(self):
        \"\"\"Simulate signal variations – degrade the active one slightly.\"\"\"
        for name in self.signal_strengths:
            if name == self.active_interface:
                self.signal_strengths[name] = max(10, self.signal_strengths[name] - random.randint(0, 3))
            else:
                self.signal_strengths[name] = min(100, self.signal_strengths[name] + random.randint(-2, 2))
                self.signal_strengths[name] = max(30, self.signal_strengths[name])

    def ai_decision(self) -> Dict:
        \"\"\"Analyze interfaces and decide if a switch is needed.\"\"\"
        online = [i for i in self.interfaces if i["status"] == "online" and i["signal"] > 0]
        if not online:
            return {"decision": "none", "reason": "No active connections"}

        sorted_ifaces = sorted(online, key=lambda x: x["signal"], reverse=True)
        best = sorted_ifaces[0]
        worst = sorted_ifaces[-1] if len(sorted_ifaces) > 1 else None

        active = next((i for i in self.interfaces if i["name"] == self.active_interface), None)
        if active and active["signal"] < 40 and worst and worst["signal"] > active["signal"] + 20:
            return {
                "decision": "switch",
                "from": active["name"],
                "to": worst["name"] if worst else None,
                "reason": f"{active['name']} signal is {active['signal']}% (weak). {worst['name']} has {worst['signal']}%.",
                "action": "switch"
            }

        if not active or active["name"] != best["name"]:
            return {
                "decision": "switch",
                "from": active["name"] if active else None,
                "to": best["name"],
                "reason": f"{best['name']} has the highest signal ({best['signal']}%) and is optimal.",
                "action": "switch"
            }

        return {
            "decision": "optimal",
            "best": best["name"],
            "signal": best["signal"],
            "reason": f"{best['name']} is optimal with signal {best['signal']}%."
        }

    def perform_switch(self, from_iface: str, to_iface: str) -> Dict:
        \"\"\"Switch active connection.\"\"\"
        self.active_interface = to_iface
        if to_iface in self.signal_strengths:
            self.signal_strengths[to_iface] = min(90, self.signal_strengths[to_iface] + 10)

        entry = {
            "from": from_iface,
            "to": to_iface,
            "timestamp": time.strftime("%H:%M:%S"),
            "reason": "AI triggered switch"
        }
        self.switch_history.insert(0, entry)
        self.switch_history = self.switch_history[:20]
        return entry

    def auto_switch_if_needed(self):
        \"\"\"Automatically switch if AI recommends.\"\"\"
        decision = self.ai_decision()
        if decision.get("decision") == "switch":
            from_iface = decision.get("from")
            to_iface = decision.get("to")
            if from_iface and to_iface and from_iface != to_iface:
                return self.perform_switch(from_iface, to_iface)
        return None
