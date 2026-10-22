import http from './http'

export function callHello(payload) {
  return http.post('/api/tools/helloworld', payload)
}

export function callHash(payload) {
  return http.post('/api/tools/hash', payload)
}

export function callBubbleSort(payload) {
  return http.post('/api/tools/bubble-sort', payload)
}

export function fetchTrend(params) {
  return http.get('/api/report/trend', { params })
}

export function fetchDistribution(params) {
  return http.get('/api/report/distribution', { params })
}

export function exportResult(payload) {
  return http.post('/api/tools/export', payload, { responseType: 'blob' })
}