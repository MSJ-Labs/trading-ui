import { useMe } from '../api/authApi'
import Card from '../../../shared/components/Card'

export default function ProfilePage() {
  const { data: user } = useMe()

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-semibold text-white mb-6">Profile</h2>
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
