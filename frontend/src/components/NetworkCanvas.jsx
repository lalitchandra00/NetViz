import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from '@xyflow/react'
import { Cable, MousePointerClick, X } from 'lucide-react'
import DeviceNode from './DeviceNode'
import PacketNode from './PacketNode'
import { DEVICE_TYPES } from '../lib/constants'
import { NODE_HEIGHT, NODE_WIDTH, hasConnection } from '../lib/network'
import { useNetwork } from '../store/networkStore'

const nodeTypes = { device: DeviceNode, packet: PacketNode }

export default function NetworkCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodesDelete,
    onEdgesDelete,
    selectNode,
    selectEdge,
    clearSelection,
    addDevice,
    addConnection,
    activePath,
    connectorMode,
    connectorSourceId,
    pickConnectorNode,
    cancelConnector,
  } = useNetwork()
  const { screenToFlowPosition } = useReactFlow()
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!connectorMode) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') cancelConnector()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [connectorMode, cancelConnector])

  const pathEdgeSet = useMemo(() => {
    const set = new Set()
    for (let i = 0; i < activePath.length - 1; i += 1) {
      set.add(`${activePath[i]}|${activePath[i + 1]}`)
      set.add(`${activePath[i + 1]}|${activePath[i]}`)
    }
    return set
  }, [activePath])

  const pathNodeSet = useMemo(() => new Set(activePath), [activePath])

  const displayNodes = useMemo(
    () =>
      nodes.map((node) =>
        node.type === 'device'
          ? {
              ...node,
              data: {
                ...node.data,
                pathActive: pathNodeSet.has(node.id),
                connectorSource: connectorMode && connectorSourceId === node.id,
                connectorMode,
              },
            }
          : node,
      ),
    [nodes, pathNodeSet, connectorMode, connectorSourceId],
  )

  const displayEdges = useMemo(
    () =>
      edges.map((edge) => {
        const active = pathEdgeSet.has(`${edge.source}|${edge.target}`)
        return {
          ...edge,
          animated: active,
          style: active
            ? {
                stroke: '#34d399',
                strokeWidth: 3,
                filter: 'drop-shadow(0 0 6px rgba(52,211,153,0.8))',
              }
            : { stroke: '#475569', strokeWidth: 2 },
        }
      }),
    [edges, pathEdgeSet],
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/netviz-node')
      if (!type) return
      const point = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      addDevice(type, {
        x: point.x - NODE_WIDTH / 2,
        y: point.y - NODE_HEIGHT / 2,
      })
    },
    [addDevice, screenToFlowPosition],
  )

  const handleConnect = useCallback(
    (connection) => addConnection(connection.source, connection.target),
    [addConnection],
  )

  const isValidConnection = useCallback(
    (connection) => {
      if (!connection.source || !connection.target) return false
      if (connection.source === connection.target) return false
      return !hasConnection(edges, connection.source, connection.target)
    },
    [edges],
  )

  const isEmpty = nodes.filter((node) => node.type !== 'packet').length === 0

  return (
    <div
      ref={wrapperRef}
      className={`relative h-full w-full ${connectorMode ? 'cursor-crosshair' : ''}`}
    >
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onConnect={handleConnect}
        isValidConnection={isValidConnection}
        onNodeClick={(_, node) => {
          if (node.type !== 'packet') {
            if (connectorMode) pickConnectorNode(node.id)
            else selectNode(node.id)
          }
        }}
        onEdgeClick={(_, edge) => selectEdge(edge.id)}
        onPaneClick={() => {
          clearSelection()
          if (connectorMode) cancelConnector()
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        deleteKeyCode={['Delete', 'Backspace']}
        minZoom={0.2}
        maxZoom={2.2}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: 'straight' }}
        className="bg-slate-950"
      >
        <Background gap={24} size={1} color="#1e293b" />
        <Controls
          showInteractive={false}
          className="!rounded-lg !border !border-slate-700 !bg-slate-900 !shadow-lg"
        />
        <MiniMap
          pannable
          zoomable
          className="!rounded-lg !border !border-slate-700"
          style={{ background: '#0b1120' }}
          maskColor="rgba(2, 6, 23, 0.7)"
          nodeColor={(node) =>
            DEVICE_TYPES[node.data?.type]?.color || '#334155'
          }
        />
      </ReactFlow>

      {connectorMode && (
        <div className="pointer-events-none absolute left-1/2 top-3 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-cyan-500/50 bg-slate-900/95 px-3 py-2 text-[11px] text-cyan-100 shadow-lg">
          <Cable size={14} className="text-cyan-300" />
          <span>
            {connectorSourceId
              ? `Source ${connectorSourceId} selected — click the target device`
              : 'Connector active — click the first device'}
          </span>
          <button
            type="button"
            onClick={cancelConnector}
            className="pointer-events-auto rounded p-0.5 text-cyan-300 transition hover:bg-cyan-500/20"
            title="Cancel (Esc)"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 text-slate-500">
            <MousePointerClick size={26} />
          </div>
          <div className="text-sm font-medium text-slate-300">
            Start building your network
          </div>
          <div className="max-w-xs text-[11px] text-slate-500">
            Drag devices from the left panel, or generate a topology template to
            instantly create a network.
          </div>
        </div>
      )}
    </div>
  )
}
