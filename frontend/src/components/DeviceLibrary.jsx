import { useState } from 'react'
import {
  Cable,
  Layers,
  Loader2,
  Monitor,
  Network as NetworkIcon,
  Router,
  Server,
  Sparkles,
} from 'lucide-react'
import { DEVICE_TYPE_LIST, TOPOLOGIES } from '../lib/constants'
import { useNetwork } from '../store/networkStore'

const ICONS = {
  computer: Monitor,
  router: Router,
  switch: NetworkIcon,
  server: Server,
}

export default function DeviceLibrary() {
  const {
    addDevice,
    generateTopology,
    connectorMode,
    connectorSourceId,
    toggleConnector,
  } = useNetwork()
  const [topology, setTopology] = useState('star')
  const [count, setCount] = useState(4)
  const [busy, setBusy] = useState(false)

  const handleDragStart = (event, type) => {
    event.dataTransfer.setData('application/netviz-node', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleGenerate = async () => {
    setBusy(true)
    try {
      await generateTopology(topology, Math.min(Math.max(Number(count) || 1, 1), 50))
    } finally {
      setBusy(false)
    }
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-4 overflow-y-auto bg-slate-900/60 p-4">
      <section>
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <Layers size={14} /> Device Library
        </div>
        <p className="mb-3 text-[10px] leading-relaxed text-slate-500">
          Drag a device onto the canvas, or click to place it.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DEVICE_TYPE_LIST.map((device) => {
            const Icon = ICONS[device.key]
            return (
              <button
                key={device.key}
                type="button"
                draggable
                onDragStart={(event) => handleDragStart(event, device.key)}
                onClick={() => addDevice(device.key)}
                className="group flex cursor-grab flex-col items-start gap-1.5 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-left transition hover:-translate-y-0.5 hover:border-slate-600 active:cursor-grabbing"
                style={{ borderLeft: `3px solid ${device.color}` }}
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-md"
                  style={{ background: device.soft, color: device.color }}
                >
                  <Icon size={15} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-200">
                    {device.label}
                  </div>
                  <div className="text-[9px] text-slate-500">
                    {device.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={toggleConnector}
          className={`mt-2 flex w-full items-center gap-2 rounded-lg border p-2.5 text-left transition ${
            connectorMode
              ? 'border-cyan-400/80 bg-cyan-500/15 text-cyan-100'
              : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-600'
          }`}
          style={{ borderLeft: '3px solid #22d3ee' }}
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{ background: 'rgba(34, 211, 238, 0.14)', color: '#22d3ee' }}
          >
            <Cable size={15} />
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-semibold">Connector</div>
            <div className="text-[9px] text-slate-500">
              {connectorMode
                ? connectorSourceId
                  ? `Target for ${connectorSourceId} — click a device`
                  : 'Click the first device'
                : 'Link two devices'}
            </div>
          </div>
          {connectorMode && (
            <span className="rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-cyan-200">
              ON
            </span>
          )}
        </button>
      </section>

      <section className="border-t border-slate-800 pt-4">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <Sparkles size={14} /> Topology Generator
        </div>

        <div className="mb-2 grid grid-cols-2 gap-1.5">
          {TOPOLOGIES.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTopology(item.key)}
              title={item.hint}
              className={`rounded-md border px-2 py-1.5 text-[11px] font-medium transition ${
                topology === item.key
                  ? 'border-sky-500/70 bg-sky-500/15 text-sky-200'
                  : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="mb-1 block text-[10px] uppercase tracking-wider text-slate-500">
          Devices
        </label>
        <input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(event) => setCount(event.target.value)}
          className="mb-2 w-full rounded-md border border-slate-800 bg-slate-950/70 px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-500"
        />

        <button
          type="button"
          onClick={handleGenerate}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-sky-500/60 bg-sky-500/15 px-3 py-2 text-xs font-semibold text-sky-200 transition hover:bg-sky-500/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
          Generate
        </button>
        <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
          {TOPOLOGIES.find((item) => item.key === topology)?.hint}
        </p>
      </section>

      <section className="mt-auto rounded-lg border border-slate-800 bg-slate-950/50 p-2.5">
        <div className="text-[10px] font-semibold text-slate-300">
          Quick tip
        </div>
        <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
          Drag from a node handle to another node to create a link, or use the
          Connector tool to click two devices. Select a device to edit its
          properties on the right.
        </p>
      </section>
    </aside>
  )
}
