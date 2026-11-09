import { User, Mail, Shield } from 'lucide-react'
import { useMe } from '../api/authApi'
import Card from '../../../shared/components/Card'

export default function ProfilePage() {
  const { data: user } = useMe()

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <User size={18} className="text-accent" />
        Profile
      </h2>
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
            <Row
              icon={<User size={14} />}
              label="Full name"
              value={user?.name
                || `${user?.givenName ?? ''} ${user?.familyName ?? ''}`.trim()
                || '—'}
            />
            <Row
              icon={<Mail size={14} />}
              label="Email"
              value={user?.email ?? '—'}
            />
            <div className="space-y-2 text-sm">
              <span className="text-muted flex items-center gap-1.5">
                <Shield size={14} />Roles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {user?.roles?.length ? user.roles.map((role) => (
                  <span
                    key={role}
                    className="px-2 py-0.5 rounded-md border border-line bg-raised text-xs text-white break-all"
                  >
                    {role}
                  </span>
                )) : <span className="text-white">—</span>}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted flex items-center gap-1.5">{icon}{label}</span>
      <span className="text-white">{value}</span>
    </div>
  )
}
