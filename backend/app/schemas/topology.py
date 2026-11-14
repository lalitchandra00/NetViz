from typing import List, Literal

from pydantic import BaseModel, Field


class TopologyRequest(BaseModel):
    topology_type: Literal["star", "bus", "ring", "mesh"]
    number_of_devices: int = Field(default=4, ge=1, le=50)
    existing_ids: List[str] = Field(default_factory=list)
