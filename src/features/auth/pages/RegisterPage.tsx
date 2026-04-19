import { useState } from 'react'
import { Link } from 'react-router-dom'
import { type AxiosError } from 'axios'
import { useRegister } from '../api/authApi'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'
import Card from '../../../shared/components/Card'
import IrisLogo from '../../../shared/components/IrisLogo'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const register = useRegister()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">

        <div className="mb-8 flex flex-col items-center gap-2">
          <IrisLogo iconSize={48} showWordmark={false} />
          <h1 className="text-2xl font-bold tracking-tight text-accent">Iris</h1>
          <p className="text-sm text-muted">Create your account</p>
        </div>

        <Card>
          <form onSubmit={(e) => { e.preventDefault(); register.mutate({ username, email, password }) }} className="space-y-4">
            <Input label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />

            {register.isError && (
              <p className="text-sm text-danger">
                {(register.error as AxiosError<{ detail: string }>)?.response?.data?.detail ?? 'Registration failed. Please try again.'}
              </p>
            )}

            {register.isSuccess && (
              <p className="text-sm text-accent">Account created. Redirecting to login…</p>
            )}

            <Button type="submit" loading={register.isPending}>
              {register.isPending ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent">Sign in</Link>
        </p>

      </div>
    </div>
  )
}