import { NavLink, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '../../features/auth/store/authStore'
import { useLogout } from '../../features/auth/api/authApi'
import Button from '../../shared/components/Button'

export default function AppLayout() {
  const user = useAuthStore(s => s.user)
  const logout = useLogout()

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-line px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-accent font-bold text-lg tracking-tight">Iris</span>
          <div className="flex items-center gap-6">
            <AppNavLink to="/market">Market</AppNavLink>
            <AppNavLink to="/profile">Profile</AppNavLink>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">{user?.username}</span>
          <Button
            variant="ghost"
            loading={logout.isPending}
            onClick={() => logout.mutate()}
            className="px-4 py-1.5 text-sm"
          >
            {logout.isPending ? 'Signing out…' : 'Sign out'}
          </Button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

function AppNavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-muted hover:text-white'}`
      }
    >
      {children}
    </NavLink>
  )
}
