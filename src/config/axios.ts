import axios from 'axios'
import store from '@/store'
import { logout } from '@/store/features/useSlice'
import { BE_URL, PATH } from '../utils/const'

const api = axios.create({
  baseURL: BE_URL,
  withCredentials: true, // Để cookie chứa refreshToken có thể được gửi
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.user.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 403) {
      store.dispatch(logout())
      window.location.href = PATH.HOME
    }
    return Promise.reject(error)
  }
)

export default api
