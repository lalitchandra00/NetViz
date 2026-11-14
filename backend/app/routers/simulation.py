from fastapi import APIRouter, HTTPException

from app.schemas.packet import SimulateRequest
from app.services import packet_simulator
from app.services.store import store

router = APIRouter(prefix="/simulate", tags=["simulation"])


@router.post("/send")
def send_packet(payload: SimulateRequest) -> dict:
    if payload.network is not None:
        devices = payload.network.devices
        connections = payload.network.connections
    else:
        devices = list(store.devices.values())
        connections = list(store.connections.values())

    if not devices:
        raise HTTPException(status_code=400, detail="Network has no devices")

    return packet_simulator.simulate(
        payload.source, payload.destination, payload.message, devices, connections
    )


@router.get("/history")
def simulation_history() -> list[dict]:
    return list(reversed(store.packets))
