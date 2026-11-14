from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class DeviceType(str, Enum):
    computer = "computer"
    router = "router"
    switch = "switch"
    server = "server"


class DeviceStatus(str, Enum):
    active = "active"
    inactive = "inactive"


class Position(BaseModel):
    x: float = 0
    y: float = 0


class DeviceBase(BaseModel):
    name: str = Field(min_length=1, max_length=64)
    type: DeviceType = DeviceType.computer
    ip_address: Optional[str] = None
    mac_address: Optional[str] = None
    subnet_mask: Optional[str] = "255.255.255.0"
    status: DeviceStatus = DeviceStatus.active
    position: Position = Field(default_factory=Position)


class DeviceCreate(DeviceBase):
    pass


class DeviceUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=64)
    type: Optional[DeviceType] = None
    ip_address: Optional[str] = None
    mac_address: Optional[str] = None
    subnet_mask: Optional[str] = None
    status: Optional[DeviceStatus] = None
    position: Optional[Position] = None


class Device(DeviceBase):
    id: str
