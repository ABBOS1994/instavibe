// src/config/axiosConfig.js
import axios from 'axios'
import { Info, Warning, Error } from '../components/admin/Service'

export const baseURL = '/api/v4/'
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('Token', token)
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem('Token')
    delete axiosInstance.defaults.headers.Authorization
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isTokenErrorShown = false

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response

    if (res) {
      const { status, data } = res
      const message =
        data?.message || data.error || 'Nomaʼlum xatolik yuz berdi.'

      if ((status === 401 || status === 403) && !isTokenErrorShown) {
        isTokenErrorShown = true
        Warning(message || 'Kirish muddati tugagan yoki ruxsat yo‘q.').then()
        setAuthToken(null)

        setTimeout(() => {
          isTokenErrorShown = false
          location.reload()
        }, 2000)
      } else if (status >= 504) {
        return
      } else if (status === 400) {
        Info(message)
      }
    } else {
      Error('Tarmoqda muammo bor. Internetingizni tekshiring.')
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
