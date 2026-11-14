from typing import Iterable, List

from app.schemas.connection import Connection
from app.schemas.device import Device, DeviceStatus
from app.services.graph_manager import (
    build_graph,
    connected_components,
    is_connected,
    isolated_devices,
)


def analyze(devices: Iterable[Device], connections: Iterable[Connection]) -> dict:
    devices = list(devices)
    connections = list(connections)
    graph = build_graph(devices, connections)

    return {
        "total_devices": len(devices),
        "active_devices": sum(1 for d in devices if d.status == DeviceStatus.active),
        "inactive_devices": sum(
            1 for d in devices if d.status == DeviceStatus.inactive
        ),
        "total_connections": len(connections),
        "connected": is_connected(graph),
        "components": connected_components(graph),
        "isolated_devices": isolated_devices(graph),
    }


def statistics(devices: Iterable[Device], connections: Iterable[Connection], packets: List[dict]) -> dict:
    devices = list(devices)
    connections = list(connections)
    delivered = sum(1 for p in packets if p.get("status") == "delivered")
    failed = sum(1 for p in packets if p.get("status") == "failed")
    return {
        "total_devices": len(devices),
        "total_connections": len(connections),
        "active_devices": sum(1 for d in devices if d.status == DeviceStatus.active),
        "total_packets": len(packets),
        "delivered_packets": delivered,
        "failed_packets": failed,
    }
