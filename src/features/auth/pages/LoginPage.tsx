import { useState } from 'react'
import { Link } from 'react-router-dom'
import { type AxiosError } from 'axios'
import { useLogin } from '../api/authApi'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'
import Card from '../../../shared/components/Card'
import IrisLogo from '../../../shared/components/IrisLogo'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const login = useLogin()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">

        <div className="mb-8 flex flex-col items-center gap-2">
          <IrisLogo iconSize={48} showWordmark={false} />
          <h1 className="text-2xl font-bold tracking-tight text-accent">Iris</h1>
          <p className="text-sm text-muted">Sign in to your account</p>
        </div>

        <Card>
          <form onSubmit={(e) => { e.preventDefault(); login.mutate({ username, password }) }} className="space-y-4">
            <Input label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />

            {login.isError && (
              <p className="text-sm text-danger">
                {(login.error as AxiosError<{ detail: string }>)?.response?.data?.detail ?? 'Invalid username or password.'}
              </p>
            )}

            <Button type="submit" loading={login.isPending}>
              {login.isPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-sm text-muted">
          No account?{' '}
          <Link to="/register" className="font-medium text-accent">Create one</Link>
        </p>

      </div>
    </div>
  )
}