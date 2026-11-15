import { API_BASE } from './constants'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) {
    let detail
    try {
      const body = await response.json()
      detail = body.detail
    } catch {
      detail = null
    }
    throw new Error(
      typeof detail === 'string'
        ? detail
        : detail
          ? JSON.stringify(detail)
          : `Request failed (${response.status})`,
    )
  }
  return response.json()
}

export const api = {
  health: () => request('/health'),
  generateTopology: (topologyType, count, existingIds) =>
    request('/topology/generate', {
      method: 'POST',
      body: JSON.stringify({
        topology_type: topologyType,
        number_of_devices: count,
        existing_ids: existingIds,
      }),
    }),
  simulate: (payload) =>
    request('/simulate/send', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  analyze: (network) =>
    request('/network/analyze', {
      method: 'POST',
      body: JSON.stringify(network),
    }),
}
