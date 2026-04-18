import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../api/authApi'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const login = useLogin()

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-sm">

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-accent)' }}>
            Iris
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Sign in to your account
          </p>
        </div>

        <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <form onSubmit={(e) => { e.preventDefault(); login.mutate({ username, password }) }} className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors border"
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors border"
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {login.isError && (
              <p className="text-sm" style={{ color: 'var(--color-danger)' }}>
                {(login.error as any)?.response?.data?.detail ?? 'Invalid username or password.'}
              </p>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-accent)', color: '#000' }}
            >
              {login.isPending ? 'Signing in…' : 'Sign in'}
            </button>

          </form>
        </div>

        <p className="mt-4 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          No account?{' '}
          <Link to="/register" className="font-medium" style={{ color: 'var(--color-accent)' }}>
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}
