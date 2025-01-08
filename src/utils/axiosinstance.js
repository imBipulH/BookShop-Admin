import axios from 'axios'
const BASE_URL = import.meta.env.VITE_BASE_URL
const axiosInstance = axios.create({
  baseURL: BASE_URL || 'http://147.93.31.52:8000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 10000
})

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default axiosInstance
