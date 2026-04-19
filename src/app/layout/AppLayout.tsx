import { NavLink, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { BarChart2, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../../features/auth/store/authStore'
import { useLogout } from '../../features/auth/api/authApi'
import IrisLogo from '../../shared/components/IrisLogo'
import Button from '../../shared/components/Button'

export default function AppLayout() {
  const user = useAuthStore(s => s.user)
  const logout = useLogout()

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-line px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <IrisLogo iconSize={30} />
          <div className="flex items-center gap-1">
            <AppNavLink to="/market" icon={<BarChart2 size={15} />}>Market</AppNavLink>
            <AppNavLink to="/profile" icon={<User size={15} />}>Profile</AppNavLink>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{user?.username}</span>
          <Button
            variant="ghost"
            loading={logout.isPending}
            onClick={() => logout.mutate()}
            className="px-3 py-1.5 text-sm flex items-center gap-1.5"
          >
            <LogOut size={14} />
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

function AppNavLink({ to, icon, children }: { to: string; icon: ReactNode; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'text-accent bg-raised' : 'text-muted hover:text-white hover:bg-raised'
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  )
}