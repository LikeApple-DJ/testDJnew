import axios from 'axios';

/**
 * API 基础地址（开发环境走代理）
 */
const API_BASE = '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * 演示接口 API
 */
export const demoApi = {
  helloWorld: (name) => apiClient.post('/demo/helloworld', { name }),
  hash: (input) => apiClient.post('/demo/hash', { input }),
  bubbleSort: (numbers) => apiClient.post('/demo/bubble-sort', { numbers }),
};

/**
 * 导出接口 API（返回 Blob）
 */
export const exportApi = {
  helloWorld: () => apiClient.get('/export/helloworld', { responseType: 'blob' }),
  hash: () => apiClient.get('/export/hash', { responseType: 'blob' }),
  bubbleSort: () => apiClient.get('/export/bubble-sort', { responseType: 'blob' }),
};

/**
 * 分析统计 API
 */
export const analyticsApi = {
  summary: (params) => apiClient.get('/analytics/summary', { params }),
  trend: (params) => apiClient.get('/analytics/trend', { params }),
  distribution: (params) => apiClient.get('/analytics/distribution', { params }),
};

export default apiClient;
