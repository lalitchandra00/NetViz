from typing import List

from pydantic import BaseModel, Field

from app.schemas.connection import Connection
from app.schemas.device import Device


class NetworkSnapshot(BaseModel):
    devices: List[Device] = Field(default_factory=list)
    connections: List[Connection] = Field(default_factory=list)
