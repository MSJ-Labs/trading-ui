import { useNavigate } from 'react-router-dom'
import { useMe, useLogout } from '../api/authApi'

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useMe()
  const logout = useLogout()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading…</p>
      </div>
    )
  }

  if (isError) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-md mx-auto">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-accent)' }}>Iris</h1>
          <button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="text-sm px-4 py-1.5 rounded-lg border transition-opacity disabled:opacity-50"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            {logout.isPending ? 'Signing out…' : 'Sign out'}
          </button>
        </div>

        <div className="rounded-2xl border p-6 space-y-5" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-accent)' }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{user?.username}</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{user?.email}</p>
            </div>
          </div>

          <div className="border-t pt-5 space-y-3" style={{ borderColor: 'var(--color-border)' }}>
            <Row label="Full name" value={user?.firstName || user?.lastName
              ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
              : '—'} />
            <Row label="Roles" value={user?.roles?.join(', ') ?? '—'} />
            <Row label="Member since" value={user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
              : '—'} />
            <Row label="Last login" value={user?.lastLoginAt
              ? new Date(user.lastLoginAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
              : '—'} />
          </div>

        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ color: 'var(--color-text-primary)' }}>{value}</span>
    </div>
  )
}
