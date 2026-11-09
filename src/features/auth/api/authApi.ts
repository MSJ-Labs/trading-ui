import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bff, root } from '../../../shared/lib/axios'
import { useAuthStore, type AuthUser } from '../store/authStore'

/** Login and registration are Keycloak's pages: nothing to implement here. */

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser)

  return useQuery({
    queryKey: ['me'],
    queryFn: () =>
      bff.get<AuthUser>('/user').then((r) => {
        setUser(r.data)
        return r.data
      }),
    retry: false,
    // a 401 triggers the Keycloak login (axios interceptor): never retry or refetch in a loop
    refetchOnWindowFocus: false,
  })
}

interface LogoutResponse {
  logoutUrl: string
}

/**
 * POST /logout (with the XSRF header) ends the BFF session and answers with the Keycloak
 * end-session URL. We then navigate to it (full page): it closes the SSO session and sends
 * the browser back to the front. An XHR cannot follow that cross-origin redirect itself.
 */
export function useLogout() {
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => root.post<LogoutResponse>('/logout').then((r) => r.data),
    onSuccess: ({ logoutUrl }) => {
      setUser(null)
      queryClient.clear()
      window.location.assign(logoutUrl)
    },
  })
}