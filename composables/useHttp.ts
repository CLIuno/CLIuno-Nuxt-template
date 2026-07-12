import axios from 'axios'

let http: ReturnType<typeof axios.create> | null = null

export function useHttp() {
  if (http) return http

  const config = useRuntimeConfig()
  http = axios.create({
    baseURL: config.public.apiBase as string,
    headers: { 'Content-Type': 'application/json' },
  })

  http.interceptors.request.use((cfg) => {
    const token = import.meta.client ? localStorage.getItem('token') : null
    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`
    }
    return cfg
  })

  http.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && import.meta.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        if (globalThis.location.pathname !== '/login') {
          globalThis.location.href = '/login'
        }
      }
      return Promise.reject(error)
    },
  )

  return http
}
