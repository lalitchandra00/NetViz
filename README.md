# NetViz — Interactive Network Topology Visualizer

> A web-based application for designing computer network topologies and simulating packet transmission — built as a Computer Networks mini project.

---

## Overview

NetViz lets you construct virtual networks by placing devices (computers, routers, switches, servers) on an interactive canvas, connecting them, and simulating how data packets travel through the network. It supports four classic topologies and uses graph algorithms to calculate communication paths.

---

## Features

- 🖥️ **Device Management** — Add, configure, and delete computers, routers, switches, and servers
- 🔗 **Connection Builder** — Draw virtual links between devices on a drag-and-drop canvas
- 🌐 **Topology Generator** — Auto-generate Star, Bus, Ring, and Mesh topologies
- 📦 **Packet Simulator** — Send packets between devices and animate their path
- 📊 **Network Statistics** — Live dashboard with device counts, packet success/failure rates
- 📋 **Event Logs** — Timestamped log of every network and simulation event
- 💾 **LocalStorage Persistence** — Save and load network configurations in the browser

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Tailwind CSS 4, React Flow (`@xyflow/react`) |
| Backend | Python, FastAPI |
| Graph Engine | NetworkX (BFS pathfinding) |
| Validation | Pydantic, Python `ipaddress` |
| Build Tool | Vite 8 |
| Storage | Browser LocalStorage |

---

## Project Structure

```
Topo/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, router registration
│   │   ├── routers/         # devices, networks, topology, simulation
│   │   ├── services/        # device_manager, graph_manager, packet_simulator, topology_builder
│   │   ├── schemas/         # Pydantic models (device, connection, network, packet)
│   │   └── utils/           # validators, helpers
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React UI components
│   │   ├── store/           # Zustand state management
│   │   └── lib/             # API client, utilities
│   ├── public/
│   └── package.json
├── render.yaml              # Render.com deployment config
└── context.md               # Full project specification
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at **http://localhost:8000**  
API docs available at **http://localhost:8000/docs**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## API Reference

Base URL: `http://localhost:8000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/devices` | Create a device |
| `GET` | `/devices` | List all devices |
| `GET` | `/devices/{id}` | Get a device |
| `PUT` | `/devices/{id}` | Update a device |
| `DELETE` | `/devices/{id}` | Delete a device |
| `POST` | `/connections` | Create a connection |
| `GET` | `/connections` | List all connections |
| `DELETE` | `/connections/{id}` | Delete a connection |
| `POST` | `/topology/generate` | Generate a topology |
| `POST` | `/simulate/send` | Simulate packet transmission |
| `GET` | `/simulate/history` | Get simulation history |

---

## Supported Topologies

| Topology | Description |
|---|---|
| **Star** | All devices connect to one central switch |
| **Bus** | Devices share a common backbone medium |
| **Ring** | Devices connected in a closed circular loop |
| **Mesh** | Every device connects directly to every other device |

---

## Deployment

The backend is configured for deployment on **Render.com** via [`render.yaml`](./render.yaml).

| Setting | Value |
|---|---|
| Runtime | Python 3 |
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

---

## License

[MIT](./LICENSE)
