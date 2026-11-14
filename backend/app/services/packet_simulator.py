from typing import Iterable

from app.schemas.connection import Connection
from app.schemas.device import Device
from app.services.graph_manager import build_graph, find_path
from app.services.store import store
from app.utils.helpers import new_packet_id, now_iso


def simulate(
    source: str,
    destination: str,
    message: str,
    devices: Iterable[Device],
    connections: Iterable[Connection],
) -> dict:
    devices = list(devices)
    connections = list(connections)
    device_ids = {device.id for device in devices}

    if source == destination:
        result = {
            "status": "failed",
            "source": source,
            "destination": destination,
            "reason": "Source and destination must be different devices.",
            "message": message,
        }
        _record(result)
        return result

    if source not in device_ids:
        result = {
            "status": "failed",
            "source": source,
            "destination": destination,
            "reason": f"Unknown source device: {source}",
            "message": message,
        }
        _record(result)
        return result

    if destination not in device_ids:
        result = {
            "status": "failed",
            "source": source,
            "destination": destination,
            "reason": f"Unknown destination device: {destination}",
            "message": message,
        }
        _record(result)
        return result

    graph = build_graph(devices, connections)
    path = find_path(graph, source, target=destination)

    if path is None:
        result = {
            "status": "failed",
            "source": source,
            "destination": destination,
            "reason": "No available path between devices.",
            "path": [],
            "message": message,
        }
        _record(result)
        return result

    result = {
        "status": "success",
        "packet_id": new_packet_id(),
        "source": source,
        "destination": destination,
        "path": path,
        "hops": max(len(path) - 1, 0),
        "message": message,
    }
    _record(result, delivered=True)
    return result


def _record(result: dict, delivered: bool = False) -> None:
    timestamp = now_iso()
    packet = {
        "id": result.get("packet_id") or new_packet_id(),
        "source": result["source"],
        "destination": result["destination"],
        "payload": result.get("message", ""),
        "path": result.get("path", []),
        "status": "delivered" if delivered else "failed",
        "reason": result.get("reason"),
        "created_at": timestamp,
    }
    store.packets.append(packet)
    if delivered:
        store.log_event(
            "packet_delivered",
            f"Packet {packet['id']} delivered {result['source']} -> {result['destination']} via {' -> '.join(result['path'])}",
            timestamp,
        )
    else:
        store.log_event(
            "packet_failed",
            f"Packet {packet['id']} from {result['source']} to {result['destination']} failed: {result.get('reason')}",
            timestamp,
        )
