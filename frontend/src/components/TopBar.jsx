import { FolderOpen, Network, RotateCcw, Save } from 'lucide-react'
import { useNetwork } from '../store/networkStore'

function ActionButton({ icon: Icon, label, onClick, tone = 'default' }) {
  const tones = {
    default:
      'border-slate-700 bg-slate-800/70 text-slate-200 hover:border-slate-500 hover:bg-slate-700',
    primary:
      'border-sky-500/60 bg-sky-500/15 text-sky-200 hover:bg-sky-500/25',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${tones[tone]}`}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}

export default function TopBar() {
  const { resetNetwork, saveNetwork, loadNetwork, backendOnline } = useNetwork()

  const status =
    backendOnline === null
      ? { dot: 'bg-amber-400', text: 'Checking backend', cls: 'text-amber-300' }
      : backendOnline
        ? { dot: 'bg-emerald-400', text: 'Backend online', cls: 'text-emerald-300' }
        : { dot: 'bg-rose-400', text: 'Offline mode', cls: 'text-rose-300' }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/80 px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30">
          <Network size={22} />
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-tight text-white">
            NetViz
          </h1>
          <p className="text-[11px] text-slate-400">
            Network Topology Visualizer &amp; Packet Simulator
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`mr-2 hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-[11px] sm:flex ${status.cls}`}
          title="FastAPI backend connection"
        >
          <span className={`h-2 w-2 rounded-full ${status.dot}`} />
          {status.text}
        </div>
        <ActionButton icon={RotateCcw} label="New" onClick={resetNetwork} />
        <ActionButton
          icon={Save}
          label="Save"
          onClick={saveNetwork}
          tone="primary"
        />
        <ActionButton icon={FolderOpen} label="Load" onClick={loadNetwork} />
      </div>
    </header>
  )
}
