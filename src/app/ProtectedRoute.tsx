import { Outlet } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { useMe } from '../features/auth/api/authApi'
import Button from '../shared/components/Button'

function Fullscreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      {children}
    </div>
  )
}

export default function ProtectedRoute() {
  const { isLoading, isError, error, refetch } = useMe()

  if (isLoading) {
    return (
      <Fullscreen>
        <p className="text-sm text-muted">Loading…</p>
      </Fullscreen>
    )
  }

  if (isError) {
    // 401: the axios interceptor is already sending the browser to Keycloak
    if (isAxiosError(error) && error.response?.status === 401) {
      return (
        <Fullscreen>
          <p className="text-sm text-muted">Redirecting to sign in…</p>
        </Fullscreen>
      )
    }
    // anything else (BFF down, network): do NOT bounce to login, it would not help
    return (
      <Fullscreen>
        <p className="text-sm text-muted">Unable to reach the server.</p>
        <Button variant="ghost" onClick={() => refetch()} className="px-3 py-1.5 text-sm">
          Retry
        </Button>
      </Fullscreen>
    )
  }

  return <Outlet />
}