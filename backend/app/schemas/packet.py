from typing import List, Optional

from pydantic import BaseModel, Field

from app.schemas.network import NetworkSnapshot


class SimulateRequest(BaseModel):
    source: str
    destination: str
    message: str = ""
    network: Optional[NetworkSnapshot] = None


class Packet(BaseModel):
    id: str
    source: str
    destination: str
    payload: str
    path: List[str] = Field(default_factory=list)
    status: str
    created_at: str
