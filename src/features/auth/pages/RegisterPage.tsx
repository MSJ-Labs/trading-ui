import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../api/authApi'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const register = useRegister()

  const inputStyle = {
    backgroundColor: 'var(--color-surface-raised)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text-primary)',
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-sm">

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-accent)' }}>
            Iris
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Create your account
          </p>
        </div>

        <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <form onSubmit={(e) => { e.preventDefault(); register.mutate({ username, email, password }) }} className="space-y-4">

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
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors border"
                style={inputStyle}
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
                autoComplete="new-password"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors border"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {register.isError && (
              <p className="text-sm" style={{ color: 'var(--color-danger)' }}>
                {(register.error as any)?.response?.data?.detail ?? 'Registration failed. Please try again.'}
              </p>
            )}

            {register.isSuccess && (
              <p className="text-sm" style={{ color: 'var(--color-accent)' }}>
                Account created. Redirecting to login…
              </p>
            )}

            <button
              type="submit"
              disabled={register.isPending}
              className="w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-accent)', color: '#000' }}
            >
              {register.isPending ? 'Creating account…' : 'Create account'}
            </button>

          </form>
        </div>

        <p className="mt-4 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium" style={{ color: 'var(--color-accent)' }}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}
