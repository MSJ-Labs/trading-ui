import axios, { type InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
})

// Tracks configs that have already been retried once to prevent infinite loops
const retried = new WeakSet<InternalAxiosRequestConfig>()

// Queues requests that arrived while a refresh is already in flight
let isRefreshing = false
let waiters: Array<(succeeded: boolean) => void> = []

api.interceptors.response.use(
  res => res,
  async (err) => {
    const config: InternalAxiosRequestConfig = err.config

    // Not a 401, or no config, or the failed request was the refresh itself → give up
    if (
      err.response?.status !== 401 ||
      !config ||
      config.url === '/auth/refresh'
    ) {
      return Promise.reject(err)
    }

    // Already retried this exact request → don't loop
    if (retried.has(config)) {
      window.location.href = '/login'
      return Promise.reject(err)
    }

    // Another refresh is already in flight — queue this request until it resolves
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waiters.push((succeeded) =>
          succeeded ? resolve(api(config)) : reject(err)
        )
      })
    }

    retried.add(config)
    isRefreshing = true

    try {
      await api.post('/auth/refresh')
      waiters.forEach(w => w(true))
      return api(config)
    } catch {
      waiters.forEach(w => w(false))
      window.location.href = '/login'
      return Promise.reject(err)
    } finally {
      waiters = []
      isRefreshing = false
    }
  }
)

export default api