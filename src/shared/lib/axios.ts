import axios from 'axios'

const LOGIN_URL = '/oauth2/authorization/keycloak'

function createClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    // Spring Security csrf.spa(): token in the XSRF-TOKEN cookie, echoed in X-XSRF-TOKEN.
    // These are axios defaults, set explicitly to document the contract with the BFF.
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
  })

  // No session (or expired / closed by backchannel logout): the BFF answers 401,
  // we start the Keycloak login. Full-page navigation, not an XHR: it is a 302 chain.
  client.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        window.location.assign(LOGIN_URL)
      }
      return Promise.reject(err)
    },
  )

  return client
}

// Business API, routed by the BFF to trading-core (TokenRelay).
const api = createClient('/api/v1')

// BFF's own endpoints (/bff/user...), not forwarded to a service.
export const bff = createClient('/bff')

// Spring Security's own endpoints at the BFF root (POST /logout).
export const root = createClient('')

export default api