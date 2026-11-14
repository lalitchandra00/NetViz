# NetViz — Project Progress Tracker

**Project:** Interactive Network Topology Visualizer and Packet Simulator
**Repo:** Topo
**Source of truth:** [context.md](./context.md)
**Started:** 2026-11-15
**Last updated:** 2026-11-15

---

## Overall Status

| Metric | Value |
|---|---|
| Current phase | Phase 1 — Project Setup (not started) |
| Overall completion | 0% |
| Phases complete | 0 / 6 |
| Modules complete | 0 / 6 |

**Progress bar:** `[----------] 0%`

---

## Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
- `[!]` Blocked

---

## Phase 1 — Project Setup

- [ ] Create `frontend/` and `backend/` directories
- [ ] Set up React app (Vite)
- [ ] Configure Tailwind CSS
- [ ] Install React Flow (`@xyflow/react`)
- [ ] Set up Python virtual environment
- [ ] Install FastAPI, NetworkX, Pydantic, uvicorn
- [ ] Create `requirements.txt`
- [ ] Create initial dashboard shell
- [ ] Verify frontend and backend run locally

**Deliverable:** Basic application running locally.

---

## Phase 2 — Network Editor

### Device nodes
- [ ] Custom Computer node
- [ ] Custom Router node
- [ ] Custom Switch node
- [ ] Custom Server node
- [ ] Distinct icons and colors per device type

### Canvas behaviour
- [ ] Drag-and-drop devices from library to canvas
- [ ] Move nodes (position persisted)
- [ ] Connect devices with edges
- [ ] Select node / edge
- [ ] Delete node (and attached links)
- [ ] Delete edge
- [ ] Zoom and pan
- [ ] Prevent duplicate connections
- [ ] Prevent self-connections

### Device properties panel
- [ ] Show name, type, IP, MAC, status
- [ ] Edit + save device properties
- [ ] Delete device button
- [ ] Auto-generate MAC address
- [ ] IPv4 validation (client side)
- [ ] Duplicate device ID check
- [ ] Duplicate IP address check

**Deliverable:** Functional network editor.

---

## Phase 3 — Topology Generator

- [ ] Star topology generation (central switch + N PCs)
- [ ] Bus topology generation (shared-medium backbone node)
- [ ] Ring topology generation (closed loop, circular layout)
- [ ] Mesh topology generation (full mesh, N(N-1)/2 links)
- [ ] Topology selection + device-count controls
- [ ] Unique IDs for generated devices and links
- [ ] Generated topology rendered on canvas
- [ ] Generated network editable afterwards

**Deliverable:** Automatic topology generation.

---

## Phase 4 — Backend Integration

### FastAPI foundation
- [ ] `app/main.py` with FastAPI init
- [ ] CORS configuration
- [ ] Health endpoint
- [ ] Router registration

### Device API
- [ ] `POST /api/devices`
- [ ] `GET /api/devices`
- [ ] `GET /api/devices/{device_id}`
- [ ] `PUT /api/devices/{device_id}`
- [ ] `DELETE /api/devices/{device_id}` (cascade delete links)

### Connection API
- [ ] `POST /api/connections`
- [ ] `GET /api/connections`
- [ ] `DELETE /api/connections/{connection_id}`

### Topology API
- [ ] `POST /api/topology/generate` (star, bus, ring, mesh)

### Graph engine (NetworkX)
- [ ] `graph_manager.py` build graph from devices + connections
- [ ] Connectivity check
- [ ] BFS pathfinding
- [ ] Disconnected-device detection
- [ ] `network_analyzer.py` statistics

**Deliverable:** Functional backend connected to the frontend.

---

## Phase 5 — Packet Simulation

### Backend
- [ ] `POST /api/simulate/send` endpoint
- [ ] Packet object creation (id, src, dst, payload, path, status, timestamp)
- [ ] Path calculation via BFS
- [ ] Success response (status, path, message)
- [ ] Failure response (no-path reason)
- [ ] `GET /api/simulate/history`
- [ ] Event generation (created, forwarded, delivered, failed)

### Frontend
- [ ] Source/destination selectors
- [ ] Message input
- [ ] Send Packet button
- [ ] Packet animation along path (React Flow coords)
- [ ] Success vs failure visual states
- [ ] Console log output

**Deliverable:** Working packet simulator.

---

## Phase 6 — Finalization

- [ ] Network statistics dashboard panel
  - [ ] Total devices
  - [ ] Total connections
  - [ ] Active devices
  - [ ] Total packets sent
  - [ ] Successful packets
  - [ ] Failed packets
- [ ] Event log panel with timestamps
- [ ] Save network to LocalStorage
- [ ] Load network from LocalStorage
- [ ] Reset / New Network action
- [ ] Input validation messages
- [ ] Responsive layout pass
- [ ] UI polish (theme, colors, icons)

### Testing & docs
- [ ] Functional test matrix executed (context.md §12.1)
- [ ] Edge-case tests executed (context.md §12.2)
- [ ] Integration tests (context.md §12.3)
- [ ] README documentation
- [ ] System architecture diagram
- [ ] Use-case diagram
- [ ] Data flow diagram
- [ ] Screenshots
- [ ] Project report
- [ ] Demo video / live demo

**Deliverable:** Complete working mini-project.

---

## Optional / Future Enhancements

- [ ] IPv6 addressing
- [ ] Subnet-aware transmission
- [ ] Switch MAC forwarding tables
- [ ] Router routing tables
- [ ] ARP simulation
- [ ] TCP/UDP simulation
- [ ] Packet loss + delay simulation
- [ ] Multiple path display
- [ ] Network failure simulation
- [ ] Export network diagram

---

## Work Log

Records every unit of work completed. Add a new row each session — do not delete rows.

| Date | Work done | Files / areas | Phase | Status |
|---|---|---|---|---|
| 2026-11-15 | Reviewed `context.md`; inventoried repo (docs only, no code yet) | `context.md`, `README.md` | Setup | Done |
| 2026-11-15 | Created this progress tracker with full roadmap checklist | `PROGRESS.md` | Setup | Done |

---

## Session Notes

- Repo currently contains only `context.md`, `README.md` (placeholder), `LICENSE`, `.gitignore`. No frontend/backend code exists yet.
- Recommended next action: start Phase 1 (scaffold frontend + backend).

---

## How to Update This File

1. When starting a task: change `[ ]` → `[~]` and update the "Current phase" / "Last updated" fields.
2. When finishing a task: change to `[x]`, append a row to the **Work Log**.
3. Recalculate **Overall Status** percentages after each phase completes.
4. Never delete old work-log rows; append only.
