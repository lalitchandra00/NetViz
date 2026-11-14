import {
  Activity,
  Cable,
  CheckCircle2,
  Cpu,
  Send,
  XCircle,
} from 'lucide-react'
import { useNetwork } from '../store/networkStore'

const CARDS = [
  { key: 'totalDevices', label: 'Devices', icon: Cpu, color: '#38bdf8' },
  { key: 'totalConnections', label: 'Connections', icon: Cable, color: '#a78bfa' },
  { key: 'activeDevices', label: 'Active', icon: Activity, color: '#34d399' },
  { key: 'totalPackets', label: 'Packets', icon: Send, color: '#fbbf24' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2, color: '#34d399' },
  { key: 'failed', label: 'Failed', icon: XCircle, color: '#fb7185' },
]

export default function StatsBar() {
  const { stats } = useNetwork()

  return (
    <div className="grid grid-cols-3 gap-px border-b border-slate-800 bg-slate-800/60 md:grid-cols-6">
      {CARDS.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.key}
            className="flex items-center gap-2.5 bg-slate-950/80 px-4 py-2.5"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: `${card.color}1a`, color: card.color }}
            >
              <Icon size={16} />
            </div>
            <div>
              <div className="text-base font-semibold leading-none text-white">
                {stats[card.key]}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                {card.label}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
