import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// HelloWorld 接口
export function getHello() {
  return api.get('/hello')
}

// SHA-256 哈希接口
export function getHash(input) {
  return api.post('/hash/sha256', { input })
}

// 冒泡排序接口
export function getBubbleSort(params = {}) {
  return api.post('/sort/bubble', params)
}

// 导出接口
export function exportData(params) {
  return api.get('/export', {
    params: params,
    responseType: 'blob'
  })
}