from typing import Dict, List

from app.schemas.connection import Connection
from app.schemas.device import Device


class NetworkStore:
    def __init__(self) -> None:
        self.devices: Dict[str, Device] = {}
        self.connections: Dict[str, Connection] = {}
        self.packets: List[dict] = []
        self.events: List[dict] = []

    def reset(self) -> None:
        self.devices.clear()
        self.connections.clear()
        self.packets.clear()
        self.events.clear()

    def log_event(self, kind: str, description: str, timestamp: str) -> None:
        self.events.append(
            {"type": kind, "description": description, "timestamp": timestamp}
        )


store = NetworkStore()
