import { DEVICE_TYPES } from './constants'

export const NODE_WIDTH = 150
export const NODE_HEIGHT = 74

const PREFIX = { computer: 'PC', router: 'R', switch: 'SW', server: 'SRV' }
const LABEL = {
  computer: 'Computer',
  router: 'Router',
  switch: 'Switch',
  server: 'Server',
}

export function randomMac() {
  const bytes = [0x02, 0x00]
  for (let i = 0; i < 4; i += 1) bytes.push(Math.floor(Math.random() * 256))
  return bytes.map((b) => b.toString(16).toUpperCase().padStart(2, '0')).join(':')
}

export function isValidIPv4(value) {
  if (!value) return false
  const parts = value.split('.')
  if (parts.length !== 4) return false
  return parts.every((part) => {
    if (!/^\d{1,3}$/.test(part)) return false
    if (part.length > 1 && part.startsWith('0')) return false
    const num = Number(part)
    return num >= 0 && num <= 255
  })
}

function usedIds(nodes) {
  return new Set(nodes.filter((n) => n.type !== 'packet').map((n) => n.id))
}

function nextId(prefix, used) {
  let index = 1
  while (used.has(`${prefix}-${String(index).padStart(2, '0')}`)) index += 1
  const id = `${prefix}-${String(index).padStart(2, '0')}`
  used.add(id)
  return id
}

function nextName(label, nodes) {
  const pattern = new RegExp(`^${label} (\\d+)$`)
  let max = 0
  nodes.forEach((node) => {
    const match = node.data?.name?.match(pattern)
    if (match) max = Math.max(max, Number(match[1]))
  })
  return `${label} ${max + 1}`
}

function nextIp(nodes) {
  const used = new Set(
    nodes.map((node) => node.data?.ip_address).filter(Boolean),
  )
  let index = 2
  while (used.has(`192.168.1.${index}`) && index < 254) index += 1
  return `192.168.1.${index}`
}

export function createDevice(type, position, nodes) {
  const meta = DEVICE_TYPES[type] || DEVICE_TYPES.computer
  const used = usedIds(nodes)
  return {
    id: nextId(PREFIX[type] || 'DEV', used),
    name: nextName(LABEL[type] || 'Device', nodes),
    type,
    ip_address: type === 'switch' ? '' : nextIp(nodes),
    mac_address: randomMac(),
    subnet_mask: '255.255.255.0',
    status: 'active',
    position: {
      x: Math.round(position?.x ?? 0),
      y: Math.round(position?.y ?? 0),
    },
  }
}

export function deviceToNode(device) {
  return {
    id: device.id,
    type: 'device',
    position: {
      x: device.position?.x ?? 0,
      y: device.position?.y ?? 0,
    },
    data: {
      name: device.name,
      type: device.type,
      ip_address: device.ip_address ?? '',
      mac_address: device.mac_address ?? '',
      subnet_mask: device.subnet_mask ?? '255.255.255.0',
      status: device.status ?? 'active',
    },
  }
}

export function nodeToDevice(node) {
  return {
    id: node.id,
    name: node.data.name,
    type: node.data.type,
    ip_address: node.data.ip_address || null,
    mac_address: node.data.mac_address || null,
    subnet_mask: node.data.subnet_mask || null,
    status: node.data.status || 'active',
    position: { x: node.position.x, y: node.position.y },
  }
}

export function createConnection(source, target, edges) {
  const used = new Set(edges.map((edge) => edge.id))
  let index = 1
  while (used.has(`LINK-${String(index).padStart(2, '0')}`)) index += 1
  return {
    id: `LINK-${String(index).padStart(2, '0')}`,
    source,
    target,
    type: 'straight',
    data: { status: 'active' },
  }
}

export function connectionToEdge(connection) {
  return {
    id: connection.id,
    source: connection.source,
    target: connection.target,
    type: 'straight',
    data: { status: connection.status || 'active' },
  }
}

export function edgeToConnection(edge) {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    status: edge.data?.status || 'active',
  }
}

export function hasConnection(edges, source, target) {
  return edges.some(
    (edge) =>
      (edge.source === source && edge.target === target) ||
      (edge.source === target && edge.target === source),
  )
}

function circleCenters(count, cx, cy, radius) {
  const centers = []
  for (let i = 0; i < count; i += 1) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / Math.max(count, 1)
    centers.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    })
  }
  return centers
}

export function localGenerateTopology(type, count, existingNodes) {
  const working = [...existingNodes]
  const devices = []
  const connections = []
  const centers = circleCenters(count, 460, 340, 240)

  const add = (deviceType, center, nameOverride) => {
    const device = createDevice(
      deviceType,
      { x: center.x - NODE_WIDTH / 2, y: center.y - NODE_HEIGHT / 2 },
      working,
    )
    if (nameOverride) device.name = nameOverride
    working.push(deviceToNode(device))
    devices.push(device)
    return device
  }
  const link = (a, b) => connections.push(createConnection(a, b, connections))

  if (type === 'star') {
    const sw = add('switch', { x: 460, y: 340 }, 'Central Switch')
    centers.forEach((center) => {
      const pc = add('computer', center)
      link(pc.id, sw.id)
    })
  } else if (type === 'bus') {
    const bus = add('switch', { x: 460, y: 340 }, 'Bus Backbone')
    centers.forEach((center) => {
      const pc = add('computer', center)
      link(pc.id, bus.id)
    })
  } else if (type === 'ring') {
    const pcs = centers.map((center) => add('computer', center))
    if (pcs.length === 2) link(pcs[0].id, pcs[1].id)
    pcs.forEach((pc, index) => link(pc.id, pcs[(index + 1) % pcs.length].id))
  } else if (type === 'mesh') {
    const pcs = centers.map((center) => add('computer', center))
    for (let i = 0; i < pcs.length; i += 1) {
      for (let j = i + 1; j < pcs.length; j += 1) {
        link(pcs[i].id, pcs[j].id)
      }
    }
  }

  return {
    topology_type: type,
    generated_devices: devices,
    generated_connections: connections,
  }
}

export function localSimulate(nodes, edges, source, destination, message) {
  const deviceNodes = nodes.filter((node) => node.type !== 'packet')
  const ids = new Set(deviceNodes.map((node) => node.id))

  const fail = (reason) => ({
    status: 'failed',
    source,
    destination,
    message,
    reason,
  })

  if (source === destination) {
    return fail('Source and destination must be different devices.')
  }
  if (!ids.has(source)) return fail(`Unknown source device: ${source}`)
  if (!ids.has(destination)) return fail(`Unknown destination device: ${destination}`)

  const active = new Set(
    deviceNodes
      .filter((node) => node.data?.status === 'active')
      .map((node) => node.id),
  )
  if (!active.has(source) || !active.has(destination)) {
    return fail('Source or destination device is offline.')
  }

  const adjacency = new Map()
  active.forEach((id) => adjacency.set(id, []))
  edges.forEach((edge) => {
    if (active.has(edge.source) && active.has(edge.target)) {
      adjacency.get(edge.source).push(edge.target)
      adjacency.get(edge.target).push(edge.source)
    }
  })

  const previous = new Map([[source, null]])
  const queue = [source]
  while (queue.length) {
    const current = queue.shift()
    if (current === destination) break
    const neighbors = adjacency.get(current) || []
    neighbors.forEach((neighbor) => {
      if (!previous.has(neighbor)) {
        previous.set(neighbor, current)
        queue.push(neighbor)
      }
    })
  }

  if (!previous.has(destination)) return fail('No available path between devices.')

  const path = []
  let cursor = destination
  while (cursor !== null) {
    path.unshift(cursor)
    cursor = previous.get(cursor)
  }
  return {
    status: 'success',
    source,
    destination,
    path,
    message,
    packet_id: `PKT-${Date.now()}`,
  }
}

export function computeStats(nodes, edges, packets) {
  const deviceNodes = nodes.filter((node) => node.type !== 'packet')
  return {
    totalDevices: deviceNodes.length,
    totalConnections: edges.length,
    activeDevices: deviceNodes.filter((node) => node.data?.status === 'active')
      .length,
    totalPackets: packets.length,
    delivered: packets.filter((packet) => packet.status === 'delivered').length,
    failed: packets.filter((packet) => packet.status === 'failed').length,
  }
}
