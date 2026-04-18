import { useMe, useLogout } from '../api/authApi'
import Button from '../../../shared/components/Button'
import Card from '../../../shared/components/Card'

export default function ProfilePage() {
  const { data: user } = useMe()
  const logout = useLogout()

  return (
    <div className="min-h-screen px-4 py-10 bg-background">
      <div className="max-w-md mx-auto">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-accent">Iris</h1>
          <Button variant="ghost" loading={logout.isPending} onClick={() => logout.mutate()} className="w-auto px-4 py-1.5 text-sm">
            {logout.isPending ? 'Signing out…' : 'Sign out'}
          </Button>
        </div>

        <Card>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-raised text-accent">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{user?.username}</p>
                <p className="text-sm text-muted">{user?.email}</p>
              </div>
            </div>

            <div className="border-t border-line pt-5 space-y-3">
              <Row label="Full name" value={user?.firstName || user?.lastName
                ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() : '—'} />
              <Row label="Roles" value={user?.roles?.join(', ') ?? '—'} />
              <Row label="Member since" value={user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} />
              <Row label="Last login" value={user?.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} />
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  )
}
