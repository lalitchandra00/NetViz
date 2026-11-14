import math
from typing import Dict, List, Set

from app.schemas.connection import Connection
from app.schemas.device import Device, DeviceStatus, DeviceType, Position


def _circle_positions(n: int, cx: float, cy: float, radius: float) -> List[Position]:
    positions: List[Position] = []
    for i in range(n):
        angle = -math.pi / 2 + (2 * math.pi * i) / max(n, 1)
        positions.append(
            Position(
                x=round(cx + radius * math.cos(angle), 1),
                y=round(cy + radius * math.sin(angle), 1),
            )
        )
    return positions


def _make_id_factory(existing_ids: Set[str]):
    counters: Dict[str, int] = {}
    used = set(existing_ids)

    def make(prefix: str) -> str:
        index = counters.get(prefix, 0) + 1
        candidate = f"{prefix}-{index:02d}"
        while candidate in used:
            index += 1
            candidate = f"{prefix}-{index:02d}"
        counters[prefix] = index
        used.add(candidate)
        return candidate

    return make


def _pc(name_index: int, position: Position, new_id) -> Device:
    return Device(
        id=new_id("PC"),
        name=f"Computer {name_index}",
        type=DeviceType.computer,
        ip_address=f"192.168.1.{name_index + 1}",
        status=DeviceStatus.active,
        position=position,
    )


def generate(topology_type: str, number_of_devices: int, existing_ids: List[str]):
    new_id = _make_id_factory(set(existing_ids))
    devices: List[Device] = []
    connections: List[Connection] = []

    def link(source: str, target: str) -> None:
        connections.append(
            Connection(id=f"LINK-{len(connections) + 1:02d}", source=source, target=target)
        )

    if topology_type == "star":
        center = Position(x=420, y=320)
        switch = Device(
            id=new_id("SW"),
            name="Central Switch",
            type=DeviceType.switch,
            status=DeviceStatus.active,
            position=center,
        )
        pcs = [
            _pc(i + 1, position, new_id)
            for i, position in enumerate(
                _circle_positions(number_of_devices, 420, 320, 240)
            )
        ]
        devices = [switch, *pcs]
        for pc in pcs:
            link(pc.id, switch.id)

    elif topology_type == "bus":
        backbone = Device(
            id=new_id("BUS"),
            name="Bus Backbone",
            type=DeviceType.switch,
            status=DeviceStatus.active,
            position=Position(x=420, y=320),
        )
        pcs = [
            _pc(i + 1, position, new_id)
            for i, position in enumerate(
                _circle_positions(number_of_devices, 420, 320, 240)
            )
        ]
        devices = [backbone, *pcs]
        for pc in pcs:
            link(pc.id, backbone.id)

    elif topology_type == "ring":
        positions = _circle_positions(number_of_devices, 420, 320, 240)
        pcs = [_pc(i + 1, position, new_id) for i, position in enumerate(positions)]
        devices = pcs
        if number_of_devices == 2:
            link(pcs[0].id, pcs[1].id)
        for i in range(number_of_devices):
            link(pcs[i].id, pcs[(i + 1) % number_of_devices].id)

    elif topology_type == "mesh":
        positions = _circle_positions(number_of_devices, 420, 320, 240)
        pcs = [_pc(i + 1, position, new_id) for i, position in enumerate(positions)]
        devices = pcs
        for i in range(number_of_devices):
            for j in range(i + 1, number_of_devices):
                link(pcs[i].id, pcs[j].id)

    else:
        raise ValueError(f"Unsupported topology type: {topology_type}")

    return {
        "topology_type": topology_type,
        "generated_devices": devices,
        "generated_connections": connections,
    }
