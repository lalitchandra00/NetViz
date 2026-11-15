export const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export const DEVICE_TYPES = {
  computer: {
    key: 'computer',
    label: 'Computer',
    color: '#38bdf8',
    soft: 'rgba(56, 189, 248, 0.14)',
    description: 'End-user host',
  },
  router: {
    key: 'router',
    label: 'Router',
    color: '#a78bfa',
    soft: 'rgba(167, 139, 250, 0.14)',
    description: 'Connects networks',
  },
  switch: {
    key: 'switch',
    label: 'Switch',
    color: '#34d399',
    soft: 'rgba(52, 211, 153, 0.14)',
    description: 'LAN connector',
  },
  server: {
    key: 'server',
    label: 'Server',
    color: '#fbbf24',
    soft: 'rgba(251, 191, 36, 0.14)',
    description: 'Provides services',
  },
}

export const DEVICE_TYPE_LIST = Object.values(DEVICE_TYPES)

export const TOPOLOGIES = [
  { key: 'star', label: 'Star', hint: 'Devices around one central switch' },
  { key: 'bus', label: 'Bus', hint: 'Shared backbone medium' },
  { key: 'ring', label: 'Ring', hint: 'Closed loop of devices' },
  { key: 'mesh', label: 'Mesh', hint: 'Every device interconnected' },
]
