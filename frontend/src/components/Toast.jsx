import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

const TONES = {
  success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200',
  error: 'border-rose-500/50 bg-rose-500/10 text-rose-200',
  info: 'border-sky-500/50 bg-sky-500/10 text-sky-200',
}

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

export default function Toast({ notice }) {
  const Icon = ICONS[notice.type] || Info
  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium shadow-2xl ${
        TONES[notice.type] || TONES.info
      }`}
    >
      <Icon size={15} />
      {notice.message}
    </div>
  )
}
