from fastapi import APIRouter, HTTPException

from app.schemas.connection import Connection, ConnectionCreate
from app.schemas.network import NetworkSnapshot
from app.services import network_analyzer
from app.services.store import store
from app.utils.helpers import new_connection_id, now_iso

router = APIRouter(tags=["network"])
connections_router = APIRouter(prefix="/connections", tags=["connections"])


@router.get("/network")
def get_network() -> dict:
    return {
        "devices": list(store.devices.values()),
        "connections": list(store.connections.values()),
    }


@router.put("/network")
def load_network(snapshot: NetworkSnapshot) -> dict:
    store.reset()
    for device in snapshot.devices:
        store.devices[device.id] = device
    for link in snapshot.connections:
        store.connections[link.id] = link
    store.log_event("network_loaded", "Network configuration loaded", now_iso())
    return {"devices": len(store.devices), "connections": len(store.connections)}


@router.post("/network/reset")
def reset_network() -> dict:
    store.reset()
    return {"status": "reset"}


@router.get("/network/statistics")
def get_statistics() -> dict:
    return network_analyzer.statistics(
        store.devices.values(), store.connections.values(), store.packets
    )


@router.post("/network/analyze")
def analyze_network(snapshot: NetworkSnapshot) -> dict:
    return network_analyzer.analyze(snapshot.devices, snapshot.connections)


@connections_router.post("", response_model=Connection, status_code=201)
def create_connection(payload: ConnectionCreate) -> Connection:
    if payload.source == payload.target:
        raise HTTPException(status_code=422, detail="A device cannot connect to itself")
    for device_id in (payload.source, payload.target):
        if device_id not in store.devices:
            raise HTTPException(status_code=404, detail=f"Device not found: {device_id}")
    for link in store.connections.values():
        pair = {link.source, link.target}
        if pair == {payload.source, payload.target}:
            raise HTTPException(status_code=409, detail="Connection already exists")
    connection = Connection(
        id=new_connection_id(), source=payload.source, target=payload.target
    )
    store.connections[connection.id] = connection
    store.log_event(
        "connection_created",
        f"Connection {connection.id} created {payload.source} <-> {payload.target}",
        now_iso(),
    )
    return connection


@connections_router.get("", response_model=list[Connection])
def list_connections() -> list[Connection]:
    return list(store.connections.values())


@connections_router.delete("/{connection_id}")
def delete_connection(connection_id: str) -> dict:
    if connection_id not in store.connections:
        raise HTTPException(status_code=404, detail="Connection not found")
    del store.connections[connection_id]
    store.log_event(
        "connection_deleted", f"Connection {connection_id} removed", now_iso()
    )
    return {"deleted": connection_id}
