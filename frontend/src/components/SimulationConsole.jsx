import { useMemo, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  ScrollText,
  Send,
  XCircle,
} from 'lucide-react'
import { useNetwork } from '../store/networkStore'

const EVENT_COLORS = {
  device_created: '#38bdf8',
  device_updated: '#94a3b8',
  device_deleted: '#fb7185',
  connection_created: '#a78bfa',
  connection_deleted: '#f59e0b',
  topology_generated: '#34d399',
  packet_created: '#facc15',
  packet_delivered: '#34d399',
  packet_failed: '#fb7185',
  network_saved: '#22d3ee',
  network_loaded: '#22d3ee',
  network_reset: '#94a3b8',
}

function formatTime(timestamp) {
  try {
    return new Date(timestamp).toLocaleTimeString()
  } catch {
    return ''
  }
}

export default function SimulationConsole() {
  const { nodes, runSimulation, simulation, events } = useNetwork()
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [message, setMessage] = useState('Hello Network!')

  const options = useMemo(
    () =>
      nodes
        .filter((node) => node.type !== 'packet')
        .map((node) => ({ id: node.id, name: node.data.name })),
    [nodes],
  )

  const optionIds = options.map((option) => option.id)
  const effectiveSource = optionIds.includes(source)
    ? source
    : optionIds[0] || ''
  const effectiveDestination = optionIds.includes(destination)
    ? destination
    : optionIds[1] || optionIds[0] || ''

  const result = simulation.result
  const canSend =
    options.length >= 2 &&
    effectiveSource &&
    effectiveDestination &&
    !simulation.running

  return (
    <footer className="flex h-64 shrink-0 border-t border-slate-800 bg-slate-900/70">
      <div className="flex w-[55%] flex-col gap-2 border-r border-slate-800 p-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <Send size={14} /> Packet Simulator
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <label className="block">
            <span className="mb-1 block text-[9px] uppercase tracking-wider text-slate-500">
              Source
            </span>
            <select
              value={effectiveSource}
              onChange={(event) => setSource(event.target.value)}
              className={selectClass}
            >
              {options.length === 0 && <option value="">No devices</option>}
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.id} · {option.name}
                </option>
              ))}
            </select>
          </label>
          <ArrowRight size={15} className="mb-2 text-slate-600" />
          <label className="block">
            <span className="mb-1 block text-[9px] uppercase tracking-wider text-slate-500">
              Destination
            </span>
            <select
              value={effectiveDestination}
              onChange={(event) => setDestination(event.target.value)}
              className={selectClass}
            >
              {options.length === 0 && <option value="">No devices</option>}
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.id} · {option.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-end gap-2">
          <label className="block flex-1">
            <span className="mb-1 block text-[9px] uppercase tracking-wider text-slate-500">
              Message
            </span>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Payload…"
              className={selectClass}
            />
          </label>
          <button
            type="button"
            disabled={!canSend}
            onClick={() =>
              runSimulation({
                source: effectiveSource,
                destination: effectiveDestination,
                message,
              })
            }
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/60 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {simulation.running ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            Send Packet
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {!result && !simulation.running && (
            <div className="mt-2 rounded-lg border border-dashed border-slate-800 px-3 py-3 text-[10px] text-slate-500">
              Choose a source and destination, then send a packet to see the
              computed path animated on the canvas.
            </div>
          )}

          {simulation.running && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-[11px] text-sky-200">
              <Loader2 size={13} className="animate-spin" />
              Calculating path and transmitting…
            </div>
          )}

          {result && !simulation.running && (
            <div
              className={`mt-2 rounded-lg border px-3 py-2 ${
                result.status === 'success'
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-rose-500/40 bg-rose-500/10'
              }`}
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold">
                {result.status === 'success' ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span className="text-emerald-200">Packet delivered</span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} className="text-rose-400" />
                    <span className="text-rose-200">Transmission failed</span>
                  </>
                )}
              </div>

              {result.status === 'success' ? (
                <>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    {result.path.map((id, index) => (
                      <span key={`${id}-${index}`} className="flex items-center gap-1">
                        <span className="rounded bg-slate-950/70 px-1.5 py-0.5 font-mono text-[10px] text-emerald-200">
                          {id}
                        </span>
                        {index < result.path.length - 1 && (
                          <ArrowRight size={10} className="text-slate-500" />
                        )}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    {Math.max(result.path.length - 1, 0)} hop(s) ·
                    message “{message}”
                  </div>
                </>
              ) : (
                <div className="mt-1 text-[10px] text-rose-200">
                  {result.reason}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex w-[45%] flex-col p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <ScrollText size={14} /> Event Log
          </div>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] text-slate-400">
            {events.length}
          </span>
        </div>
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {events.length === 0 && (
            <div className="text-[10px] text-slate-600">
              No events yet. Create devices and send packets to populate the log.
            </div>
          )}
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-2 rounded border border-slate-800/70 bg-slate-950/40 px-2 py-1"
            >
              <span
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background: EVENT_COLORS[event.type] || '#94a3b8',
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[10px] text-slate-300">
                  {event.description}
                </div>
                <div className="text-[9px] text-slate-600">
                  {formatTime(event.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

const selectClass =
  'w-full rounded-md border border-slate-800 bg-slate-950/70 px-2.5 py-1.5 text-xs text-slate-200 outline-none transition focus:border-sky-500'
