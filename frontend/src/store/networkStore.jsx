import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react'
import { api } from '../lib/api'
import { DEVICE_TYPES } from '../lib/constants'
import {
  NODE_HEIGHT,
  NODE_WIDTH,
  computeStats,
  connectionToEdge,
  createConnection,
  createDevice,
  deviceToNode,
  edgeToConnection,
  hasConnection,
  localGenerateTopology,
  localSimulate,
  nodeToDevice,
} from '../lib/network'

const NetworkContext = createContext(null)
const STORAGE_KEY = 'netviz.network.v1'
const PACKET_NODE_ID = '__packet__'

let eventSeq = 0

export function NetworkProvider({ children }) {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState(null)
  const [connectorMode, setConnectorMode] = useState(false)
  const [connectorSourceId, setConnectorSourceId] = useState(null)
  const [events, setEvents] = useState([])
  const [packets, setPackets] = useState([])
  const [activePath, setActivePath] = useState([])
  const [simulation, setSimulation] = useState({
    status: 'idle',
    running: false,
    result: null,
    error: null,
  })
  const [backendOnline, setBackendOnline] = useState(null)
  const [notice, setNotice] = useState(null)

  const nodesRef = useRef(nodes)
  const edgesRef = useRef(edges)
  const rafRef = useRef(null)
  const noticeTimer = useRef(null)

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  useEffect(() => {
    edgesRef.current = edges
  }, [edges])

  const addEvent = useCallback((type, description) => {
    eventSeq += 1
    const event = {
      id: eventSeq,
      type,
      description,
      timestamp: new Date().toISOString(),
    }
    setEvents((previous) => [event, ...previous].slice(0, 250))
  }, [])

  const pushNotice = useCallback((message, type = 'info') => {
    setNotice({ message, type, id: Date.now() })
    if (noticeTimer.current) clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(null), 3800)
  }, [])

  useEffect(() => {
    let alive = true
    api
      .health()
      .then(() => alive && setBackendOnline(true))
      .catch(() => alive && setBackendOnline(false))
    return () => {
      alive = false
    }
  }, [])

  const onNodesChange = useCallback((changes) => {
    setNodes((previous) => applyNodeChanges(changes, previous))
  }, [])

  const onEdgesChange = useCallback((changes) => {
    setEdges((previous) => applyEdgeChanges(changes, previous))
  }, [])

  const onNodesDelete = useCallback(
    (deleted) => {
      const ids = new Set(deleted.map((node) => node.id))
      setEdges((previous) =>
        previous.filter(
          (edge) => !ids.has(edge.source) && !ids.has(edge.target),
        ),
      )
      setSelectedNodeId((current) => (ids.has(current) ? null : current))
      setConnectorSourceId((current) => (ids.has(current) ? null : current))
      deleted.forEach((node) =>
        addEvent(
          'device_deleted',
          `Device ${node.data?.name || node.id} deleted`,
        ),
      )
    },
    [addEvent],
  )

  const onEdgesDelete = useCallback(
    (deleted) => {
      setSelectedEdgeId((current) =>
        deleted.some((edge) => edge.id === current) ? null : current,
      )
      deleted.forEach((edge) =>
        addEvent('connection_deleted', `Connection ${edge.id} removed`),
      )
    },
    [addEvent],
  )

  const selectNode = useCallback((id) => {
    setSelectedNodeId(id)
    setSelectedEdgeId(null)
  }, [])

  const selectEdge = useCallback((id) => {
    setSelectedEdgeId(id)
    setSelectedNodeId(null)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
  }, [])

  const addDevice = useCallback(
    (type, position) => {
      const meta = DEVICE_TYPES[type] || DEVICE_TYPES.computer
      const deviceCount = nodesRef.current.filter(
        (node) => node.type !== 'packet',
      ).length
      const fallback = {
        x: 140 + (deviceCount % 5) * 180,
        y: 120 + Math.floor(deviceCount / 5) * 140,
      }
      const device = createDevice(type, position || fallback, nodesRef.current)
      const node = deviceToNode(device)
      setNodes((previous) => [...previous, node])
      setSelectedNodeId(node.id)
      setSelectedEdgeId(null)
      addEvent('device_created', `Device ${node.data.name} (${node.id}) created`)
      pushNotice(`${meta.label} added to canvas.`, 'success')
      return node
    },
    [addEvent, pushNotice],
  )

  const updateDevice = useCallback(
    (id, patch) => {
      const { position, ...dataPatch } = patch
      setNodes((previous) =>
        previous.map((node) =>
          node.id === id
            ? {
                ...node,
                position: position ?? node.position,
                data: { ...node.data, ...dataPatch },
              }
            : node,
        ),
      )
      addEvent('device_updated', `Device ${id} updated`)
    },
    [addEvent],
  )

  const removeDevice = useCallback(
    (id) => {
      const node = nodesRef.current.find((item) => item.id === id)
      setNodes((previous) => previous.filter((item) => item.id !== id))
      setEdges((previous) =>
        previous.filter((edge) => edge.source !== id && edge.target !== id),
      )
      setSelectedNodeId((current) => (current === id ? null : current))
      setConnectorSourceId((current) => (current === id ? null : current))
      addEvent('device_deleted', `Device ${node?.data?.name || id} deleted`)
    },
    [addEvent],
  )

  const addConnection = useCallback(
    (source, target) => {
      if (!source || !target) return { ok: false }
      if (source === target) {
        pushNotice('A device cannot connect to itself.', 'error')
        return { ok: false }
      }
      if (hasConnection(edgesRef.current, source, target)) {
        pushNotice('These devices are already connected.', 'error')
        return { ok: false }
      }
      const edge = createConnection(source, target, edgesRef.current)
      setEdges((previous) => [...previous, edge])
      addEvent(
        'connection_created',
        `Connection ${edge.id} created ${source} <-> ${target}`,
      )
      return { ok: true, edge }
    },
    [addEvent, pushNotice],
  )

  const cancelConnector = useCallback(() => {
    setConnectorMode(false)
    setConnectorSourceId(null)
  }, [])

  const toggleConnector = useCallback(() => {
    setConnectorMode((active) => {
      if (active) {
        setConnectorSourceId(null)
        return false
      }
      setSelectedNodeId(null)
      setSelectedEdgeId(null)
      pushNotice('Connector active — click two devices to link them.', 'info')
      return true
    })
  }, [pushNotice])

  const pickConnectorNode = useCallback(
    (id) => {
      if (!id) return
      if (!connectorSourceId) {
        setConnectorSourceId(id)
        return
      }
      if (connectorSourceId === id) {
        pushNotice('Pick a different device to complete the link.', 'error')
        return
      }
      const result = addConnection(connectorSourceId, id)
      setConnectorSourceId(null)
      if (result.ok) setConnectorMode(false)
    },
    [addConnection, connectorSourceId, pushNotice],
  )

  const removeConnection = useCallback(
    (id) => {
      setEdges((previous) => previous.filter((edge) => edge.id !== id))
      setSelectedEdgeId((current) => (current === id ? null : current))
      addEvent('connection_deleted', `Connection ${id} removed`)
    },
    [addEvent],
  )

  const generateTopology = useCallback(
    async (type, count) => {
      const existingIds = nodesRef.current
        .filter((node) => node.type !== 'packet')
        .map((node) => node.id)
      let generated
      let mode = 'backend'
      try {
        generated = await api.generateTopology(type, count, existingIds)
      } catch {
        generated = localGenerateTopology(type, count, nodesRef.current)
        mode = 'local'
      }
      const newNodes = generated.generated_devices.map(deviceToNode)
      const newEdges = generated.generated_connections.map(connectionToEdge)
      setNodes((previous) => [...previous, ...newNodes])
      setEdges((previous) => [...previous, ...newEdges])
      const label = type.charAt(0).toUpperCase() + type.slice(1)
      addEvent(
        'topology_generated',
        `${label} topology generated (${newNodes.length} devices, ${newEdges.length} links)`,
      )
      pushNotice(
        `${label} topology generated with ${newNodes.length} devices.`,
        'success',
      )
      return { devices: newNodes.length, connections: newEdges.length, mode }
    },
    [addEvent, pushNotice],
  )

  const stopAnimation = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setNodes((previous) =>
      previous.filter((node) => node.id !== PACKET_NODE_ID),
    )
  }, [])

  const animatePacket = useCallback(
    (path) =>
      new Promise((resolve) => {
        const points = path
          .map((id) => {
            const node = nodesRef.current.find((item) => item.id === id)
            if (!node) return null
            const width = node.measured?.width ?? NODE_WIDTH
            const height = node.measured?.height ?? NODE_HEIGHT
            return {
              x: node.position.x + width / 2,
              y: node.position.y + height / 2,
            }
          })
          .filter(Boolean)

        if (points.length < 2) {
          resolve()
          return
        }

        const segmentDuration = 430
        const totalDuration = segmentDuration * (points.length - 1)
        const start = performance.now()

        const step = (now) => {
          const elapsed = Math.min(now - start, totalDuration)
          const segment = Math.min(
            Math.floor(elapsed / segmentDuration),
            points.length - 2,
          )
          const localT =
            (elapsed - segment * segmentDuration) / segmentDuration
          const a = points[segment]
          const b = points[segment + 1]
          const x = a.x + (b.x - a.x) * localT
          const y = a.y + (b.y - a.y) * localT

          setNodes((previous) => {
            const rest = previous.filter(
              (node) => node.id !== PACKET_NODE_ID,
            )
            return [
              ...rest,
              {
                id: PACKET_NODE_ID,
                type: 'packet',
                position: { x: x - 8, y: y - 8 },
                draggable: false,
                selectable: false,
                connectable: false,
                data: {},
              },
            ]
          })

          if (elapsed < totalDuration) {
            rafRef.current = requestAnimationFrame(step)
          } else {
            rafRef.current = null
            setTimeout(() => {
              setNodes((previous) =>
                previous.filter((node) => node.id !== PACKET_NODE_ID),
              )
              resolve()
            }, 160)
          }
        }

        rafRef.current = requestAnimationFrame(step)
      }),
    [],
  )

  const snapshot = useCallback(
    () => ({
      devices: nodesRef.current
        .filter((node) => node.type !== 'packet')
        .map(nodeToDevice),
      connections: edgesRef.current.map(edgeToConnection),
    }),
    [],
  )

  const runSimulation = useCallback(
    async ({ source, destination, message }) => {
      if (!source || !destination) {
        pushNotice('Select both a source and a destination.', 'error')
        return
      }
      if (nodesRef.current.filter((node) => node.type !== 'packet').length < 2) {
        pushNotice('Add at least two devices before sending a packet.', 'error')
        return
      }

      setSimulation({ status: 'running', running: true, result: null, error: null })
      addEvent('packet_created', `Packet created ${source} -> ${destination}`)

      let result
      let mode = 'backend'
      try {
        result = await api.simulate({
          source,
          destination,
          message,
          network: snapshot(),
        })
        setBackendOnline(true)
      } catch {
        result = localSimulate(
          nodesRef.current,
          edgesRef.current,
          source,
          destination,
          message,
        )
        mode = 'local'
      }

      if (result.status === 'success') {
        setActivePath(result.path || [])
        await animatePacket(result.path || [])
      }

      const packet = {
        id: result.packet_id || `PKT-${Date.now()}`,
        source,
        destination,
        message,
        path: result.path || [],
        status: result.status === 'success' ? 'delivered' : 'failed',
        reason: result.reason || null,
        mode,
        timestamp: new Date().toISOString(),
      }
      setPackets((previous) => [packet, ...previous].slice(0, 100))
      setSimulation({ status: 'done', running: false, result, error: null })

      if (result.status === 'success') {
        addEvent(
          'packet_delivered',
          `Packet ${packet.id} delivered via ${result.path.join(' -> ')}`,
        )
        pushNotice(
          `Packet delivered in ${Math.max(result.path.length - 1, 0)} hop(s).`,
          'success',
        )
      } else {
        addEvent('packet_failed', `Packet failed: ${result.reason}`)
        pushNotice(result.reason || 'Transmission failed.', 'error')
      }

      setTimeout(() => setActivePath([]), 1600)
    },
    [addEvent, animatePacket, pushNotice, snapshot],
  )

  const saveNetwork = useCallback(() => {
    try {
      const payload = {
        version: 1,
        savedAt: new Date().toISOString(),
        devices: nodesRef.current
          .filter((node) => node.type !== 'packet')
          .map(nodeToDevice),
        connections: edgesRef.current.map(edgeToConnection),
        packets,
        events,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      addEvent('network_saved', 'Network saved to browser storage')
      pushNotice('Network saved to browser storage.', 'success')
      return { ok: true }
    } catch {
      pushNotice('Failed to save network.', 'error')
      return { ok: false }
    }
  }, [packets, events, addEvent, pushNotice])

  const loadNetwork = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      pushNotice('No saved network found in browser storage.', 'error')
      return { ok: false }
    }
    try {
      const data = JSON.parse(raw)
      setNodes((data.devices || []).map(deviceToNode))
      setEdges((data.connections || []).map(connectionToEdge))
      setPackets(data.packets || [])
      setEvents(data.events || [])
      setSelectedNodeId(null)
      setSelectedEdgeId(null)
      setConnectorMode(false)
      setConnectorSourceId(null)
      setActivePath([])
      setSimulation({ status: 'idle', running: false, result: null, error: null })
      addEvent('network_loaded', 'Network loaded from browser storage')
      pushNotice('Network loaded from browser storage.', 'success')
      return { ok: true }
    } catch {
      pushNotice('Saved network is corrupted.', 'error')
      return { ok: false }
    }
  }, [addEvent, pushNotice])

  const resetNetwork = useCallback(() => {
    stopAnimation()
    setNodes([])
    setEdges([])
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
    setConnectorMode(false)
    setConnectorSourceId(null)
    setPackets([])
    setActivePath([])
    setSimulation({ status: 'idle', running: false, result: null, error: null })
    addEvent('network_reset', 'Network reset — canvas cleared')
    pushNotice('Canvas cleared.', 'info')
  }, [addEvent, pushNotice, stopAnimation])

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId && node.type !== 'packet') || null,
    [nodes, selectedNodeId],
  )
  const selectedEdge = useMemo(
    () => edges.find((edge) => edge.id === selectedEdgeId) || null,
    [edges, selectedEdgeId],
  )
  const stats = useMemo(
    () => computeStats(nodes, edges, packets),
    [nodes, edges, packets],
  )

  const value = useMemo(
    () => ({
      nodes,
      edges,
      events,
      packets,
      stats,
      simulation,
      backendOnline,
      notice,
      activePath,
      selectedNode,
      selectedEdge,
      selectedNodeId,
      selectedEdgeId,
      onNodesChange,
      onEdgesChange,
      onNodesDelete,
      onEdgesDelete,
      selectNode,
      selectEdge,
      clearSelection,
      connectorMode,
      connectorSourceId,
      toggleConnector,
      cancelConnector,
      pickConnectorNode,
      addDevice,
      updateDevice,
      removeDevice,
      addConnection,
      removeConnection,
      generateTopology,
      runSimulation,
      saveNetwork,
      loadNetwork,
      resetNetwork,
      pushNotice,
    }),
    [
      nodes,
      edges,
      events,
      packets,
      stats,
      simulation,
      backendOnline,
      notice,
      activePath,
      selectedNode,
      selectedEdge,
      selectedNodeId,
      selectedEdgeId,
      onNodesChange,
      onEdgesChange,
      onNodesDelete,
      onEdgesDelete,
      selectNode,
      selectEdge,
      clearSelection,
      connectorMode,
      connectorSourceId,
      toggleConnector,
      cancelConnector,
      pickConnectorNode,
      addDevice,
      updateDevice,
      removeDevice,
      addConnection,
      removeConnection,
      generateTopology,
      runSimulation,
      saveNetwork,
      loadNetwork,
      resetNetwork,
      pushNotice,
    ],
  )

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) throw new Error('useNetwork must be used within NetworkProvider')
  return context
}
