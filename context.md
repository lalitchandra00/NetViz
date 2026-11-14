# NetViz – Interactive Network Topology Visualizer and Packet Simulator

**Project Type:** Computer Networks Mini Project  
**Project Category:** Web-Based Network Simulation Application  
**Frontend:** React.js, Tailwind CSS, React Flow  
**Backend:** Python, FastAPI  
**Graph Processing:** NetworkX  
**Validation:** Pydantic, Python `ipaddress`  
**Storage:** Browser LocalStorage (initial version)

---

# 1. Project Overview

## 1.1 Introduction

NetViz is an interactive, web-based application designed to help students understand computer network topologies, networking devices, and packet transmission through visual simulations.

The application allows users to create virtual computer networks by adding devices such as computers, routers, switches, and servers. Users can connect these devices through virtual links, configure their network properties, and simulate the transmission of data packets between devices.

The application supports four fundamental network topologies: Star, Bus, Ring, and Mesh. It also provides a packet simulation engine that calculates possible communication paths and visually demonstrates how data travels through connected devices.

The main objective is to provide a practical and interactive learning environment for understanding fundamental Computer Networks concepts without requiring physical networking equipment.

## 1.2 Problem Statement

Learning computer networking concepts often involves understanding abstract diagrams, network structures, and data transmission processes.

Students may find it difficult to visualize how devices communicate, how different topologies are constructed, and what happens when a network connection fails.

NetViz addresses this problem by providing an interactive environment where users can construct network structures, configure devices, simulate packet transmission, and observe communication failures.

## 1.3 Project Objectives

1. Provide an interactive environment for designing computer network topologies.
2. Allow users to add and configure virtual networking devices.
3. Support the creation of Star, Bus, Ring, and Mesh topologies.
4. Visualize connections between networking devices.
5. Allow users to assign IP addresses and other device properties.
6. Simulate packet transmission between source and destination devices.
7. Calculate communication paths using graph algorithms.
8. Demonstrate successful and failed packet transmission.
9. Provide network statistics and simulation logs.
10. Help students understand fundamental networking concepts through practical demonstrations.

---

# 2. Scope of the Project

The application will implement a software-based network simulation environment.

It will not establish actual physical connections between computers or configure real networking hardware.

All devices, connections, and packet transmissions will be represented virtually.

## 2.1 Included Features

- Interactive network canvas.
- Drag-and-drop networking devices.
- Device creation, editing, and deletion.
- Virtual connections between devices.
- Star topology generation.
- Bus topology generation.
- Ring topology generation.
- Mesh topology generation.
- IP address configuration.
- MAC address assignment.
- Network connectivity analysis.
- Packet transmission simulation.
- Shortest-path calculation using BFS.
- Packet movement animation.
- Packet delivery success and failure.
- Simulation event logs.
- Network statistics.
- Save and load network configurations.

## 2.2 Excluded Features

The initial version will not implement:

- Actual Ethernet frame transmission.
- Physical router or switch configuration.
- Real-time packet capture.
- Full TCP/IP protocol implementation.
- Advanced routing protocols such as OSPF and BGP.
- Real-world network monitoring.
- Physical network hardware integration.

These features may be considered future enhancements.

---

# 3. Technology Stack

## 3.1 Frontend

**React.js**

Used to develop the interactive user interface.

Responsibilities:
- Dashboard rendering.
- Device management.
- Network canvas.
- User interactions.
- Packet animation.
- Displaying simulation results.

**Tailwind CSS**

Used for application styling and responsive layouts.

**React Flow (@xyflow/react)**

Used to implement the network editor.

Responsibilities:
- Creating draggable nodes.
- Connecting devices through edges.
- Selecting nodes and connections.
- Zooming and panning.
- Displaying custom device components.
- Animating connections.

Official documentation: https://reactflow.dev/

## 3.2 Backend

**Python**

Used to implement the networking simulation logic.

**FastAPI**

Used to expose backend functionality through REST APIs.

Responsibilities:
- Device management.
- Network configuration.
- Topology generation.
- Graph processing.
- Packet simulation.
- Data validation.

Official documentation: https://fastapi.tiangolo.com/

## 3.3 Graph Processing

**NetworkX**

Used to represent the virtual network as a graph.

Each device represents a graph node, and each connection represents a graph edge.

Responsibilities:
- Creating network graphs.
- Checking connectivity.
- Finding paths between devices.
- Identifying disconnected devices.
- Analyzing network structures.

Official documentation: https://networkx.org/

## 3.4 Additional Libraries

| Library | Purpose |
|---|---|
| Pydantic | Request and response validation |
| ipaddress | IPv4 address validation |
| uuid | Unique device and packet identifiers |
| json | Network configuration serialization |
| React Icons or Lucide | Device icons |
| Axios or Fetch API | Frontend-backend communication |

## 3.5 Storage

Use browser LocalStorage for the first version.

It will store:
- Network configurations.
- Device information.
- Device positions.
- Connections.
- Selected topology.

A database is not mandatory for the initial implementation.

---

# 4. System Architecture

The application will follow a frontend-backend architecture.

## 4.1 Architecture Overview

User → React Frontend → FastAPI Backend → Network Simulation Engine → Response → React Frontend.

### Frontend Responsibilities

- Display the network canvas.
- Allow users to create devices.
- Allow users to connect devices.
- Display device configurations.
- Send simulation requests.
- Animate packet transmission.
- Display logs and statistics.

### Backend Responsibilities

- Receive network configurations.
- Validate device information.
- Generate network graphs.
- Calculate communication paths.
- Simulate packet delivery.
- Return simulation results.

### Simulation Engine Responsibilities

- Represent devices as graph nodes.
- Represent connections as graph edges.
- Identify source and destination devices.
- Calculate a valid communication path.
- Determine whether communication is possible.
- Generate packet simulation events.

## 4.2 Application Workflow

1. User opens NetViz.
2. User creates a new network.
3. User adds networking devices.
4. User connects devices.
5. User selects a topology template or creates a custom topology.
6. User configures IP and MAC addresses.
7. User selects a source and destination.
8. User enters a sample message.
9. User clicks Send Packet.
10. Backend calculates the communication path.
11. Frontend animates packet movement.
12. Application displays the final result.
13. Simulation history and statistics are updated.

---

# 5. Application Modules

The application will consist of six major modules.

## Module 1: Device Management

### Objective

Allow users to create, configure, update, and delete virtual networking devices.

### Supported Devices

**1. Computer**

Represents an end-user device connected to a network.

Properties:
- Device ID.
- Device Name.
- IP Address.
- MAC Address.
- Device Type.
- Position on Canvas.
- Status.

**2. Router**

Represents a networking device used to connect different IP networks.

Properties:
- Router ID.
- Device Name.
- IP Address.
- MAC Address.
- Connected Interfaces.
- Status.

**3. Switch**

Represents a networking device that connects devices within a LAN.

Properties:
- Switch ID.
- Device Name.
- MAC Address.
- Connected Devices.
- Status.

**4. Server**

Represents a server that provides services to other network devices.

Properties:
- Server ID.
- Device Name.
- IP Address.
- MAC Address.
- Status.

### Functional Requirements

- Users can add devices.
- Users can select device types.
- Users can assign device names.
- Users can configure IP addresses.
- MAC addresses can be generated automatically.
- Users can edit device properties.
- Users can delete devices.
- Deleting a device must also remove its connected links.
- Duplicate device identifiers must not be allowed.
- Invalid IP addresses must be rejected.

### Expected Result

Users should be able to manage all networking devices through the application interface.

---

## Module 2: Network Connection Builder

### Objective

Allow users to establish virtual connections between devices.

### Functionality

Users can connect two devices by creating an edge between their corresponding nodes on the network canvas.

Example:

PC-01 → Switch-01

PC-02 → Switch-01

PC-03 → Switch-01

### Functional Requirements

- Users can connect two compatible devices.
- Connections must be visually represented.
- Users can delete existing connections.
- The application must prevent duplicate connections.
- The application must prevent connections from a device to itself.
- Deleting a device must delete its associated connections.
- Every connection must have a unique identifier.

### Connection Data

Each connection should contain:

- Connection ID.
- Source Device ID.
- Destination Device ID.
- Connection Type.
- Connection Status.

For the initial version, use undirected connections to represent bidirectional virtual links.

### Expected Result

The user should be able to construct a custom network by connecting devices.

---

## Module 3: Topology Generator

### Objective

Automatically generate predefined network topologies.

The application must support four types of topology.

### 3.1 Star Topology

In Star Topology, all computers connect to one central switch.

Example:

PC-01 → Switch-01

PC-02 → Switch-01

PC-03 → Switch-01

PC-04 → Switch-01

Implementation:
1. Create one central switch.
2. Create the required number of computers.
3. Connect every computer to the central switch.
4. Arrange devices visually around the switch.

### 3.2 Bus Topology

In Bus Topology, devices share a common communication backbone.

Implementation:
1. Create a virtual bus backbone.
2. Create the required number of computers.
3. Connect each computer to the bus.
4. Display the bus as a shared communication medium.

Important: Model the bus as a shared-medium node in the simulation rather than pretending it is a physical switch.

### 3.3 Ring Topology

In Ring Topology, devices are connected in a closed loop.

Implementation:
1. Create the required number of computers.
2. Connect each computer to the next.
3. Connect the final computer back to the first computer.
4. Arrange devices in a circular layout.

### 3.4 Mesh Topology

In Mesh Topology, devices have multiple connections.

For a full mesh, every device connects directly to every other device.

For N devices, the number of connections is:

N × (N - 1) / 2

Implementation:
1. Create the required number of devices.
2. Generate connections between every pair of devices.
3. Display the resulting mesh network.

### Functional Requirements

- Users can select a topology.
- Users can specify the number of devices.
- The application automatically creates the topology.
- Generated devices receive unique IDs.
- Generated connections receive unique IDs.
- The resulting topology must appear on the canvas.
- Users can modify the generated network afterward.

---

## Module 4: Packet Transmission Simulator

### Objective

Simulate the movement of data packets between devices in the virtual network.

This is the primary demonstration feature of NetViz.

### 4.1 Packet Creation

Users should be able to select:

- Source Device.
- Destination Device.
- Message or Payload.

Example:

Source: PC-01

Destination: PC-03

Message: Hello Network!

When the user clicks Send Packet, the frontend sends the request to the backend.

### 4.2 Path Calculation

The backend converts the current network configuration into a NetworkX graph.

Each device represents a node.

Each connection represents an edge.

The backend checks whether a path exists between the source and destination.

Use Breadth-First Search (BFS) to find a path with the minimum number of edges in an unweighted graph.

Example:

PC-01 → Switch-01 → PC-03

### 4.3 Packet Simulation

If a valid path exists:

1. Create a packet object.
2. Store the source and destination IDs.
3. Store the payload.
4. Store the calculated path.
5. Return the simulation result.
6. Frontend animates the packet along the path.
7. Display successful delivery.

If no path exists:

1. Detect that no route is available in the simulated graph.
2. Return a failed transmission result.
3. Display an appropriate error message.
4. Record the failure in the event log.

### 4.4 Packet Data Structure

A packet should contain:

- Packet ID.
- Source Device ID.
- Destination Device ID.
- Payload.
- Path.
- Status.
- Creation Timestamp.

### 4.5 Packet Animation

The frontend should visually demonstrate packet movement.

Example:

PC-01 → Switch-01 → PC-03

The packet should move from the source to the intermediate switch and then to the destination.

Use React Flow's edge and node information to calculate the visual positions.

The animation should be handled by the frontend, while the backend provides the calculated path and simulation result.

### 4.6 Simulation Results

For successful transmission:

- Packet ID.
- Source.
- Destination.
- Path.
- Status.
- Message.

For failed transmission:

- Packet ID, if created.
- Source.
- Destination.
- Failure reason.
- Status.

Important: The initial simulator demonstrates graph-based connectivity and packet forwarding at a conceptual level. It does not implement the complete Ethernet, ARP, IP routing, or TCP/IP protocol stack.

---

## Module 5: Network Configuration

### Objective

Allow users to configure networking properties of individual devices.

### Configuration Properties

| Property | Description |
|---|---|
| Device Name | Name of the device |
| Device Type | Computer, router, switch, server |
| IP Address | IPv4 address |
| Subnet Mask | Network mask |
| MAC Address | Device hardware-address representation |
| Status | Active or inactive |

### Validation Requirements

- Validate IPv4 address format.
- Prevent duplicate IP addresses within the same simulated LAN.
- Validate device names.
- Generate unique MAC address representations.
- Display invalid configuration errors.

The application should distinguish between an IP address being syntactically valid and devices being able to communicate. Actual communication rules will be added to the simulation engine.

---

## Module 6: Network Statistics and Logs

### Objective

Provide an overview of the network and its simulation activity.

### Dashboard Statistics

Display:

- Total Devices.
- Total Connections.
- Active Devices.
- Total Packets Sent.
- Successfully Delivered Packets.
- Failed Packets.

### Event Logs

Record events such as:

- Device Created.
- Device Deleted.
- Connection Created.
- Connection Removed.
- Packet Created.
- Packet Forwarded.
- Packet Delivered.
- Packet Transmission Failed.

Each event should include a timestamp and description.

### Expected Result

Users should be able to understand the current network state and review previous simulation activity.

---

# 6. Frontend Design Specification

## 6.1 Dashboard Layout

The application should use a clean, modern dashboard interface.

### Main Sections

**1. Top Navigation Bar**
- Application Logo.
- Project Name.
- New Network.
- Save Network.
- Reset Network.

**2. Left Sidebar – Device Library**
- Computer.
- Router.
- Switch.
- Server.
- Add Device.

**3. Center Section – Network Canvas**
- Display network devices.
- Display connections.
- Drag-and-drop support.
- Zoom and pan.
- Select nodes.
- Delete connections.

**4. Right Sidebar – Device Properties**
- Selected Device Name.
- Device Type.
- IP Address.
- MAC Address.
- Device Status.
- Update and Delete options.

**5. Bottom Panel – Simulation Console**
- Source Device.
- Destination Device.
- Message Input.
- Send Packet button.
- Simulation Logs.
- Packet Status.

## 6.2 Additional Pages

The application should include:

1. Dashboard.
2. Network Editor.
3. Topology Templates.
4. Simulation History.
5. About Project.

For the initial version, the dashboard and network editor can be combined into a single page.

## 6.3 UI Design Guidelines

- Use a dark navy or light professional theme.
- Use distinct icons for each device.
- Use different colors for successful and failed packet transmission.
- Make network connections easy to identify.
- Provide clear validation messages.
- Keep the network canvas as the main focus.
- Ensure the application is responsive.

---

# 7. Backend Architecture and Folder Structure

Recommended backend structure:

```text
backend/
│
├── app/
│   │
│   ├── main.py
│   │
│   ├── routers/
│   │   ├── devices.py
│   │   ├── networks.py
│   │   ├── topology.py
│   │   └── simulation.py
│   │
│   ├── services/
│   │   ├── device_manager.py
│   │   ├── topology_builder.py
│   │   ├── graph_manager.py
│   │   ├── packet_simulator.py
│   │   └── network_analyzer.py
│   │
│   ├── schemas/
│   │   ├── device.py
│   │   ├── connection.py
│   │   ├── network.py
│   │   └── packet.py
│   │
│   └── utils/
│       ├── validators.py
│       └── helpers.py
│
├── requirements.txt
└── README.md
```

### Responsibilities

**main.py**
- Initialize FastAPI.
- Register API routers.
- Configure CORS.
- Provide application health endpoint.

**device_manager.py**
- Create devices.
- Update devices.
- Delete devices.
- Validate device information.

**topology_builder.py**
- Generate Star topology.
- Generate Bus topology.
- Generate Ring topology.
- Generate Mesh topology.

**graph_manager.py**
- Convert devices and connections into a graph.
- Check connectivity.
- Calculate paths.
- Identify disconnected devices.

**packet_simulator.py**
- Generate packet records.
- Process transmission requests.
- Determine packet delivery status.
- Generate simulation events.

**network_analyzer.py**
- Calculate network statistics.
- Analyze connected components.
- Count devices and links.

---

# 8. API Specification

The frontend will communicate with the backend through REST APIs.

Base URL:

`http://localhost:8000/api`

## 8.1 Device APIs

### POST /devices

Create a new device.

Request fields:
- name
- type
- ip_address
- mac_address

Response:
- device_id
- device_name
- device_type
- ip_address
- mac_address
- status

### GET /devices

Retrieve all devices.

### GET /devices/{device_id}

Retrieve information about a specific device.

### PUT /devices/{device_id}

Update device properties.

### DELETE /devices/{device_id}

Delete a device and its associated connections.

## 8.2 Connection APIs

### POST /connections

Create a virtual connection.

Request fields:
- source_id
- target_id

Response:
- connection_id
- source_id
- target_id
- status

### GET /connections

Retrieve all network connections.

### DELETE /connections/{connection_id}

Delete an existing connection.

## 8.3 Topology APIs

### POST /topology/generate

Generate a predefined network topology.

Request fields:
- topology_type
- number_of_devices

Supported topology types:
- star
- bus
- ring
- mesh

Response:
- generated_devices
- generated_connections
- topology_type

## 8.4 Simulation APIs

### POST /simulate/send

Simulate packet transmission.

Request example:

```json
{
  "source": "PC-01",
  "destination": "PC-02",
  "message": "Hello Network!"
}
```

Successful response example:

```json
{
  "status": "success",
  "source": "PC-01",
  "destination": "PC-02",
  "path": [
    "PC-01",
    "Switch-01",
    "PC-02"
  ],
  "message": "Hello Network!"
}
```

Failed response example:

```json
{
  "status": "failed",
  "reason": "No available path between devices."
}
```

## 8.5 Statistics APIs

### GET /network/statistics

Return:
- Total Devices.
- Total Connections.
- Total Packets.
- Successful Packets.
- Failed Packets.
- Active Devices.

### GET /simulate/history

Return previously generated simulation records.

---

# 9. Data Models

The application should maintain the following logical data structures.

## 9.1 Device

```json
{
  "id": "PC-01",
  "name": "Computer 1",
  "type": "computer",
  "ip_address": "192.168.1.2",
  "mac_address": "00:1A:2B:3C:4D:5E",
  "status": "active",
  "position": {
    "x": 200,
    "y": 150
  }
}
```

## 9.2 Connection

```json
{
  "id": "LINK-01",
  "source": "PC-01",
  "target": "SW-01",
  "status": "active"
}
```

## 9.3 Packet

```json
{
  "id": "PKT-01",
  "source": "PC-01",
  "destination": "PC-02",
  "payload": "Hello Network!",
  "path": [
    "PC-01",
    "SW-01",
    "PC-02"
  ],
  "status": "delivered"
}
```

## 9.4 Network Configuration

A network configuration should contain:

- Network ID.
- Network Name.
- Topology Type.
- Devices Array.
- Connections Array.
- Creation Timestamp.

---

# 10. Core Algorithms

## 10.1 Graph Representation

Represent the virtual network using an undirected graph.

- Vertices represent devices.
- Edges represent connections.

Example:

PC-01 — SW-01 — PC-02

The graph contains three vertices and two edges.

Use NetworkX to construct and manage the graph.

## 10.2 BFS Pathfinding

Use Breadth-First Search to find a path between two devices.

Algorithm:

1. Start from the source device.
2. Mark it as visited.
3. Add it to a queue.
4. Visit its neighboring devices.
5. Continue until the destination is reached.
6. Reconstruct the path.
7. Return the path.

If the destination cannot be reached, return a no-path result.

Time complexity:

O(V + E)

Where:
- V = Number of devices.
- E = Number of connections.

BFS finds a path with the minimum number of edges when every connection has equal cost.

## 10.3 Topology Generation

Star:
- Create one central switch.
- Connect all computers to the switch.

Bus:
- Create one shared-medium backbone.
- Connect all computers to the backbone.

Ring:
- Connect devices in sequence.
- Connect the final device to the first device.

Mesh:
- Connect every device to every other device for a full mesh.

For N devices:
- Full mesh connections = N(N - 1)/2.

---

# 11. Important Networking Concepts Demonstrated

The project should demonstrate the following Computer Networks topics:

| Concept | Implementation |
|---|---|
| Network Topology | Four topology templates |
| Network Devices | Computer, router, switch, server |
| IP Addressing | Device IP configuration |
| MAC Address | Device identification representation |
| Network Graph | Device and connection representation |
| BFS | Pathfinding |
| Packet Transmission | Software simulation |
| Network Connectivity | Reachability checks |
| Packet Delivery | Success and failure states |
| Network Failure | Disconnection scenarios |

### Important Technical Limitations

The initial application is a conceptual network simulator, not a complete network emulator.

For accurate networking behavior in future versions:

- Implement MAC forwarding tables for switches.
- Implement routing tables for routers.
- Implement ARP resolution.
- Implement subnet-aware communication.
- Add packet headers and protocol fields.
- Implement different forwarding and routing rules.

Do not claim that BFS alone represents actual Ethernet switching or IP routing.

---

# 12. Testing and Validation

Testing is essential to ensure the application behaves correctly.

## 12.1 Functional Testing

| Test | Expected Result |
|---|---|
| Add a computer | Device appears on canvas |
| Add a switch | Switch appears on canvas |
| Connect two devices | Link appears |
| Delete a device | Device and links are removed |
| Generate Star topology | All PCs connect to central switch |
| Generate Ring topology | Closed loop is created |
| Generate Mesh topology | All devices are interconnected |
| Enter valid IP | IP is accepted |
| Enter invalid IP | Validation error appears |
| Send packet through connected path | Packet is delivered |
| Send packet without a path | Transmission fails |

## 12.2 Edge Case Testing

- Empty network.
- Single-device network.
- Duplicate IP address.
- Duplicate device identifier.
- Self-connection.
- Repeated connection.
- Disconnected source.
- Disconnected destination.
- Invalid source ID.
- Invalid destination ID.
- Deletion of an intermediate device.

## 12.3 Integration Testing

Verify that:
- React correctly communicates with FastAPI.
- API responses are correctly displayed.
- Network configurations are transferred correctly.
- The frontend animation matches the backend path.
- Simulation history is updated.
- Saved configurations can be restored.

---

# 13. Development Roadmap

Implement the project in the following order.

## Phase 1 – Project Setup

- Create frontend and backend directories.
- Set up React.
- Configure Tailwind CSS.
- Install React Flow.
- Set up Python virtual environment.
- Install FastAPI and NetworkX.
- Create the initial dashboard.

Deliverable: Basic application running locally.

## Phase 2 – Network Editor

- Create custom device nodes.
- Implement drag-and-drop.
- Implement device connections.
- Add device properties.
- Implement device deletion.

Deliverable: Functional network editor.

## Phase 3 – Topology Generator

- Implement Star topology.
- Implement Bus topology.
- Implement Ring topology.
- Implement Mesh topology.
- Add topology selection controls.

Deliverable: Automatic topology generation.

## Phase 4 – Backend Integration

- Create FastAPI endpoints.
- Implement device management.
- Implement connection management.
- Integrate NetworkX.
- Implement graph generation.
- Implement BFS pathfinding.

Deliverable: Functional backend connected to the frontend.

## Phase 5 – Packet Simulation

- Implement packet creation.
- Implement source and destination selection.
- Calculate communication paths.
- Return simulation results.
- Implement frontend packet animation.
- Add success and failure handling.

Deliverable: Working packet simulator.

## Phase 6 – Finalization

- Add network statistics.
- Add event logs.
- Implement save and load.
- Add validation.
- Test all scenarios.
- Improve interface.
- Prepare project documentation.

Deliverable: Complete working mini-project.

---

# 14. Expected Final Application

At the end of development, the application should allow a user to:

1. Open the NetViz dashboard.
2. Create a new network.
3. Add computers, routers, switches, and servers.
4. Connect devices through virtual links.
5. Generate Star, Bus, Ring, and Mesh topologies.
6. Configure IP and MAC addresses.
7. Select a source and destination device.
8. Enter a message.
9. Send a virtual packet.
10. Watch the packet travel through the calculated path.
11. Observe successful or failed transmission.
12. Review network statistics and simulation history.
13. Save and reload network configurations.

The application must work end-to-end, with the frontend, backend, and simulation engine properly integrated.

---

# 15. Project Deliverables

The final submission should include:

1. Complete frontend source code.
2. Complete backend source code.
3. Requirements file.
4. README documentation.
5. System architecture diagram.
6. Use-case diagram.
7. Data flow diagram.
8. Screenshots of the application.
9. Test cases and results.
10. Project report.
11. Demonstration video or live application.

---

# 16. Future Enhancements

After completing the initial version, consider adding:

- IPv6 addressing.
- Subnet-aware packet transmission.
- Switch MAC address forwarding tables.
- Router routing tables.
- ARP simulation.
- TCP and UDP packet simulation.
- Packet loss simulation.
- Transmission delay simulation.
- Multiple communication paths.
- Network failure simulation.
- Export network diagrams.
- Advanced routing algorithms.
- Real network integration through controlled lab environments.

---

# 17. Final Project Summary

**Project Name:** NetViz

**Project Title:** Interactive Network Topology Visualizer and Packet Simulator.

**Objective:** To develop a web-based application that helps students understand computer network topologies, device connections, and packet transmission through interactive simulations.

**Frontend:** React.js, Tailwind CSS, React Flow.

**Backend:** Python, FastAPI.

**Graph Processing:** NetworkX.

**Core Algorithms:** Breadth-First Search and graph connectivity analysis.

**Storage:** LocalStorage.

**Expected Outcome:** A functional network simulation application that allows users to construct virtual networks, generate different topologies, configure devices, and visualize packet transmission between connected devices.

**Core Principle:** Build a working network editor first, then implement topology generation, graph processing, and packet simulation as separate modules.