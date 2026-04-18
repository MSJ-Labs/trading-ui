import { Navigate } from 'react-router-dom'
import { useMe } from '../features/auth/api/authApi'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isError } = useMe()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    )
  }

  if (isError) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}