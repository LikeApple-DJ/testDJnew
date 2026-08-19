import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * HelloWorld 接口
 */
export function fetchHello() {
  return apiClient.get('/algorithm/hello')
}

/**
 * 哈希算法接口
 * @param {string} input 输入字符串
 */
export function fetchHash(input) {
  return apiClient.post('/algorithm/hash', { input })
}

/**
 * 冒泡排序接口
 * @param {number[]} numbers 数字列表
 */
export function fetchSort(numbers) {
  return apiClient.post('/algorithm/sort', { numbers })
}

/**
 * 导出接口
 * @param {string} type 算法类型: HELLO / HASH / SORT
 * @param {string} input 输入参数（HASH/SORT 需要）
 */
export function exportResult(type, input) {
  const params = { type }
  if (input) {
    params.input = input
  }
  return apiClient.get('/export/result', {
    params,
    responseType: 'blob'
  })
}
