import { useEffect, useState } from 'react'
import {
  AlertCircle,
  Info,
  Link2,
  Save,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import { DEVICE_TYPES, DEVICE_TYPE_LIST } from '../lib/constants'
import { isValidIPv4 } from '../lib/network'
import { useNetwork } from '../store/networkStore'

const MAC_PATTERN = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/

const EMPTY_FORM = {
  name: '',
  type: 'computer',
  ip_address: '',
  mac_address: '',
  subnet_mask: '255.255.255.0',
  status: 'active',
}

export default function PropertiesPanel() {
  const {
    nodes,
    selectedNode,
    selectedEdge,
    updateDevice,
    removeDevice,
    removeConnection,
    pushNotice,
  } = useNetwork()
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState(null)

  const selectedId = selectedNode?.id

  useEffect(() => {
    if (selectedNode) {
      setForm({
        name: selectedNode.data.name,
        type: selectedNode.data.type,
        ip_address: selectedNode.data.ip_address || '',
        mac_address: selectedNode.data.mac_address || '',
        subnet_mask: selectedNode.data.subnet_mask || '255.255.255.0',
        status: selectedNode.data.status || 'active',
      })
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  const setField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }))
    setError(null)
  }

  const handleSave = () => {
    if (!form.name.trim()) {
      setError('Device name is required.')
      return
    }
    if (form.ip_address && !isValidIPv4(form.ip_address.trim())) {
      setError('Enter a valid IPv4 address, e.g. 192.168.1.10')
      return
    }
    if (form.mac_address && !MAC_PATTERN.test(form.mac_address.trim())) {
      setError('Enter a valid MAC address, e.g. 02:00:4F:1A:2B:3C')
      return
    }
    const duplicate = nodes.some(
      (node) =>
        node.type !== 'packet' &&
        node.id !== selectedNode.id &&
        node.data.ip_address &&
        node.data.ip_address === form.ip_address.trim(),
    )
    if (form.ip_address && duplicate) {
      setError('Another device already uses this IP address.')
      return
    }
    updateDevice(selectedNode.id, {
      ...form,
      name: form.name.trim(),
      ip_address: form.ip_address.trim(),
      mac_address: form.mac_address.trim(),
      subnet_mask: form.subnet_mask.trim(),
    })
    setError(null)
    pushNotice('Device properties updated.', 'success')
  }

  const meta = selectedNode
    ? DEVICE_TYPES[selectedNode.data.type] || DEVICE_TYPES.computer
    : null

  return (
    <aside className="flex w-80 shrink-0 flex-col overflow-y-auto bg-slate-900/60 p-4">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        <SlidersHorizontal size={14} /> Properties
      </div>

      {selectedNode && (
        <div className="flex flex-col gap-3">
          <div
            className="rounded-lg border p-3"
            style={{ borderColor: `${meta.color}55`, background: meta.soft }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">
                  {selectedNode.data.name}
                </div>
                <div
                  className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: meta.color }}
                >
                  {meta.label} · {selectedNode.id}
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${
                  form.status === 'active'
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : 'bg-rose-500/15 text-rose-300'
                }`}
              >
                {form.status}
              </span>
            </div>
          </div>

          <Field label="Device Name">
            <input
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Device Type">
            <select
              value={form.type}
              onChange={(event) => setField('type', event.target.value)}
              className={inputClass}
            >
              {DEVICE_TYPE_LIST.map((device) => (
                <option key={device.key} value={device.key}>
                  {device.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="IP Address">
            <input
              value={form.ip_address}
              onChange={(event) => setField('ip_address', event.target.value)}
              placeholder="192.168.1.10"
              className={inputClass}
            />
          </Field>

          <Field label="Subnet Mask">
            <input
              value={form.subnet_mask}
              onChange={(event) => setField('subnet_mask', event.target.value)}
              placeholder="255.255.255.0"
              className={inputClass}
            />
          </Field>

          <Field label="MAC Address">
            <input
              value={form.mac_address}
              onChange={(event) => setField('mac_address', event.target.value)}
              placeholder="02:00:4F:1A:2B:3C"
              className={inputClass}
            />
          </Field>

          <Field label="Status">
            <div className="grid grid-cols-2 gap-1.5">
              {['active', 'inactive'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setField('status', status)}
                  className={`rounded-md border px-2 py-1.5 text-[11px] font-medium capitalize transition ${
                    form.status === status
                      ? status === 'active'
                        ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-200'
                        : 'border-rose-500/60 bg-rose-500/15 text-rose-200'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </Field>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-rose-500/40 bg-rose-500/10 px-2.5 py-2 text-[10px] text-rose-200">
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-sky-500/60 bg-sky-500/15 px-3 py-2 text-xs font-semibold text-sky-200 transition hover:bg-sky-500/25"
            >
              <Save size={14} /> Update
            </button>
            <button
              type="button"
              onClick={() => removeDevice(selectedNode.id)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}

      {!selectedNode && selectedEdge && (
        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-violet-500/40 bg-violet-500/10 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Link2 size={15} className="text-violet-300" /> Connection
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-violet-300">
              {selectedEdge.id}
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-slate-300">
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Source</span>
              <span className="font-medium">{selectedEdge.source}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Target</span>
              <span className="font-medium">{selectedEdge.target}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Status</span>
              <span className="font-medium text-emerald-300">
                {selectedEdge.data?.status || 'active'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeConnection(selectedEdge.id)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
          >
            <Trash2 size={14} /> Delete Connection
          </button>
        </div>
      )}

      {!selectedNode && !selectedEdge && (
        <div className="flex flex-col gap-3 text-[11px] leading-relaxed text-slate-500">
          <div className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <Info size={15} className="mt-0.5 shrink-0 text-sky-400" />
            <div>
              Select a device or a connection on the canvas to inspect and edit
              it here.
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Network tips
            </div>
            <ul className="list-disc space-y-1 pl-4">
              <li>Drag between node handles to create links.</li>
              <li>Inactive devices are excluded from routing.</li>
              <li>Press Delete to remove selected items.</li>
              <li>Save stores the network in your browser.</li>
            </ul>
          </div>
        </div>
      )}
    </aside>
  )
}

const inputClass =
  'w-full rounded-md border border-slate-800 bg-slate-950/70 px-2.5 py-1.5 text-xs text-slate-200 outline-none transition focus:border-sky-500'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </span>
      {children}
    </label>
  )
}
