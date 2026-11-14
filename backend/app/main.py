from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import devices, networks, simulation, topology

app = FastAPI(
    title="NetViz API",
    description="Interactive Network Topology Visualizer and Packet Simulator API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(devices.router, prefix="/api")
app.include_router(networks.router, prefix="/api")
app.include_router(networks.connections_router, prefix="/api")
app.include_router(topology.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "service": "netviz-api"}
