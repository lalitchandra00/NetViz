import ipaddress
import re
from typing import Optional

_MAC_RE = re.compile(r"^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$")


def is_valid_ipv4(value: Optional[str]) -> bool:
    if not value:
        return False
    try:
        ipaddress.IPv4Address(value)
        return True
    except (ipaddress.AddressValueError, ValueError):
        return False


def is_valid_mac(value: Optional[str]) -> bool:
    if not value:
        return False
    return bool(_MAC_RE.match(value))


def is_valid_subnet_mask(value: Optional[str]) -> bool:
    if not value:
        return True
    try:
        ipaddress.IPv4Network(f"0.0.0.0/{value}")
        return True
    except (ipaddress.AddressValueError, ValueError):
        return False


def normalize_ip(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    return str(ipaddress.IPv4Address(value))
