from fastapi import HTTPException

from app.schemas.device import Device, DeviceCreate, DeviceUpdate
from app.services.store import store
from app.utils.helpers import generate_mac, now_iso
from app.utils.validators import (
    is_valid_ipv4,
    is_valid_mac,
    is_valid_subnet_mask,
    normalize_ip,
)

PREFIX_BY_TYPE = {
    "computer": "PC",
    "router": "R",
    "switch": "SW",
    "server": "SRV",
}


def _next_device_id(device_type: str) -> str:
    prefix = PREFIX_BY_TYPE.get(device_type, "DEV")
    counter = 1
    while f"{prefix}-{counter:02d}" in store.devices:
        counter += 1
    return f"{prefix}-{counter:02d}"


def _validate(payload: DeviceCreate, exclude_id: str | None = None) -> None:
    if not payload.name.strip():
        raise HTTPException(status_code=422, detail="Device name cannot be empty")
    if payload.ip_address:
        if not is_valid_ipv4(payload.ip_address):
            raise HTTPException(
                status_code=422, detail=f"Invalid IPv4 address: {payload.ip_address}"
            )
        for device in store.devices.values():
            if exclude_id and device.id == exclude_id:
                continue
            if device.ip_address == payload.ip_address:
                raise HTTPException(
                    status_code=409,
                    detail=f"Duplicate IP address: {payload.ip_address}",
                )
    if payload.mac_address and not is_valid_mac(payload.mac_address):
        raise HTTPException(
            status_code=422, detail=f"Invalid MAC address: {payload.mac_address}"
        )
    if not is_valid_subnet_mask(payload.subnet_mask):
        raise HTTPException(
            status_code=422, detail=f"Invalid subnet mask: {payload.subnet_mask}"
        )


def create_device(payload: DeviceCreate) -> Device:
    _validate(payload)
    data = payload.model_dump()
    data["ip_address"] = normalize_ip(data.get("ip_address"))
    data["mac_address"] = data.get("mac_address") or generate_mac()
    device = Device(id=_next_device_id(payload.type.value), **data)
    store.devices[device.id] = device
    store.log_event("device_created", f"Device {device.name} ({device.id}) created", now_iso())
    return device


def list_devices() -> list[Device]:
    return list(store.devices.values())


def get_device(device_id: str) -> Device:
    device = store.devices.get(device_id)
    if not device:
        raise HTTPException(status_code=404, detail=f"Device not found: {device_id}")
    return device


def update_device(device_id: str, payload: DeviceUpdate) -> Device:
    device = get_device(device_id)
    merged = DeviceCreate(
        **{
            **device.model_dump(exclude={"id"}),
            **payload.model_dump(exclude_none=True),
        }
    )
    _validate(merged, exclude_id=device_id)
    data = merged.model_dump()
    data["ip_address"] = normalize_ip(data.get("ip_address"))
    updated = Device(id=device_id, **data)
    store.devices[device_id] = updated
    store.log_event("device_updated", f"Device {updated.name} ({device_id}) updated", now_iso())
    return updated


def delete_device(device_id: str) -> dict:
    device = get_device(device_id)
    removed_links = [
        link_id
        for link_id, link in store.connections.items()
        if link.source == device_id or link.target == device_id
    ]
    for link_id in removed_links:
        del store.connections[link_id]
    del store.devices[device_id]
    store.log_event(
        "device_deleted",
        f"Device {device.name} ({device_id}) deleted with {len(removed_links)} link(s)",
        now_iso(),
    )
    return {"deleted": device_id, "removed_connections": removed_links}
