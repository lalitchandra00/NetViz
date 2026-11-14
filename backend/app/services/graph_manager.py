from typing import Iterable, List, Optional

import networkx as nx

from app.schemas.connection import Connection
from app.schemas.device import Device, DeviceStatus


def build_graph(devices: Iterable[Device], connections: Iterable[Connection]) -> nx.Graph:
    """Build an undirected graph of active devices and active links.

    Inactive devices are excluded entirely, which models an offline node that
    cannot forward traffic.
    """
    graph = nx.Graph()
    active_ids = set()
    for device in devices:
        if device.status == DeviceStatus.active:
            graph.add_node(device.id)
            active_ids.add(device.id)

    for link in connections:
        if link.status != "active":
            continue
        if link.source in active_ids and link.target in active_ids:
            graph.add_edge(link.source, link.target)

    return graph


def find_path(
    graph: nx.Graph, source: str, target: str
) -> Optional[List[str]]:
    """Shortest path by edge count using BFS (NetworkX unweighted shortest path)."""
    if source not in graph or target not in graph:
        return None
    paths = nx.single_source_shortest_path(graph, source)
    return paths.get(target)


def is_connected(graph: nx.Graph) -> bool:
    if graph.number_of_nodes() == 0:
        return True
    return nx.is_connected(graph)


def connected_components(graph: nx.Graph) -> List[List[str]]:
    return [sorted(component) for component in nx.connected_components(graph)]


def isolated_devices(graph: nx.Graph) -> List[str]:
    return sorted(node for node, degree in graph.degree() if degree == 0)
