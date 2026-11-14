import random
import uuid
from datetime import datetime, timezone


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_connection_id() -> str:
    return f"LINK-{uuid.uuid4().hex[:8].upper()}"


def new_packet_id() -> str:
    return f"PKT-{uuid.uuid4().hex[:8].upper()}"


def generate_mac() -> str:
    octets = [0x02, 0x00] + [random.randint(0, 255) for _ in range(4)]
    return ":".join(f"{octet:02X}" for octet in octets)
