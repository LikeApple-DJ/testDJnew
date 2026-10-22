import axios from 'axios'

const http = axios.create({
  baseURL: '/',
  timeout: 30000
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const userTip = error?.response?.data?.userTip || '请求失败，请稍后重试'
    // 保留原始错误交由调用方处理，并附带用户提示文案
    const wrapped = new Error(userTip)
    wrapped.cause = error
    return Promise.reject(wrapped)
  }
)

export default http