import axios from 'axios'
import { useAuthStore } from '../store/auth.js'
import router from '../router/index.js'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 自动附加 Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 处理 401 跳转登录
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

// 导出 authApi 供 store 使用（避免循环依赖）
export const authApi = {
  login: async (username, password) => {
    const res = await api.post('/auth/login', { username, password })
    return res.data
  }
}

// 接口 API
export const helloApi = {
  call: () => api.get('/hello')
}

export const hashApi = {
  call: (input, algorithm) => api.post('/hash', { input, algorithm })
}

export const sortApi = {
  call: (array) => api.post('/sort/bubble', { array })
}

export const exportApi = {
  download: (tab) => api.get('/export', { params: { tab }, responseType: 'blob' })
}

export const statsApi = {
  getCalls: (dimension, start, end) => api.get('/stats/calls', { params: { dimension, start, end } }),
  getCallers: () => api.get('/stats/callers')
}

export default api