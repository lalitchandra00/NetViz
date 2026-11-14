from fastapi import APIRouter

from app.schemas.device import Device, DeviceCreate, DeviceUpdate
from app.services import device_manager

router = APIRouter(prefix="/devices", tags=["devices"])


@router.post("", response_model=Device, status_code=201)
def create_device(payload: DeviceCreate) -> Device:
    return device_manager.create_device(payload)


@router.get("", response_model=list[Device])
def list_devices() -> list[Device]:
    return device_manager.list_devices()


@router.get("/{device_id}", response_model=Device)
def get_device(device_id: str) -> Device:
    return device_manager.get_device(device_id)


@router.put("/{device_id}", response_model=Device)
def update_device(device_id: str, payload: DeviceUpdate) -> Device:
    return device_manager.update_device(device_id, payload)


@router.delete("/{device_id}")
def delete_device(device_id: str) -> dict:
    return device_manager.delete_device(device_id)
