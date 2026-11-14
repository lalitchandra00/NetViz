import { Handle, Position } from '@xyflow/react'
import { Monitor, Network, Router, Server } from 'lucide-react'
import { DEVICE_TYPES } from '../lib/constants'

const ICONS = {
  computer: Monitor,
  router: Router,
  switch: Network,
  server: Server,
}

export default function DeviceNode({ data, selected }) {
  const meta = DEVICE_TYPES[data.type] || DEVICE_TYPES.computer
  const Icon = ICONS[data.type] || Monitor
  const offline = data.status === 'inactive'
  const highlighted = data.pathActive

  const glow = selected
    ? `0 0 0 2px ${meta.color}, 0 10px 30px -10px ${meta.color}`
    : highlighted
      ? `0 0 0 2px #34d399, 0 0 18px 2px rgba(52,211,153,0.55)`
      : '0 10px 24px -14px #000'

  return (
    <div
      className={`relative w-[150px] rounded-xl border bg-slate-900/95 px-3 py-2 transition ${
        offline ? 'opacity-60' : ''
      }`}
      style={{
        borderColor: highlighted ? '#34d399' : meta.color,
        boxShadow: glow,
        borderStyle: offline ? 'dashed' : 'solid',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: meta.color, border: 'none', width: 7, height: 7 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ background: meta.color, border: 'none', width: 7, height: 7 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: meta.color, border: 'none', width: 7, height: 7 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: meta.color, border: 'none', width: 7, height: 7 }}
      />

      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: meta.soft, color: meta.color }}
        >
          <Icon size={17} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[12px] font-semibold text-slate-100">
            {data.name}
          </div>
          <div
            className="truncate text-[9px] font-medium uppercase tracking-wider"
            style={{ color: meta.color }}
          >
            {meta.label}
          </div>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-1 text-[9px]">
        <span className="truncate text-slate-400">
          {data.ip_address || 'no IP'}
        </span>
        <span
          className={`shrink-0 font-medium ${
            offline ? 'text-rose-400' : 'text-emerald-400'
          }`}
        >
          {offline ? 'offline' : 'online'}
        </span>
      </div>
    </div>
  )
}
