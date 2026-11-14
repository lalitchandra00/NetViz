from fastapi import APIRouter

from app.schemas.topology import TopologyRequest
from app.services import topology_builder

router = APIRouter(prefix="/topology", tags=["topology"])


@router.post("/generate")
def generate_topology(payload: TopologyRequest) -> dict:
    return topology_builder.generate(
        payload.topology_type, payload.number_of_devices, payload.existing_ids
    )
