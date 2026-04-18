import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../shared/lib/axios'
import { useAuthStore, type AuthUser } from '../store/authStore'

interface LoginRequest {
  username: string
  password: string
}

interface RegisterRequest {
  username: string
  email: string
  password: string
}

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      api.post<AuthUser>('/auth/login', data).then((r) => r.data),
    onSuccess: (user) => {
      setUser(user)
      navigate('/market')
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      api.post<AuthUser>('/auth/register', data).then((r) => r.data),
    onSuccess: () => navigate('/login'),
  })
}

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser)

  return useQuery({
    queryKey: ['me'],
    queryFn: () =>
      api.get<AuthUser>('/users/me').then((r) => {
        setUser(r.data)
        return r.data
      }),
    retry: false,
  })
}

export function useLogout() {
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      setUser(null)
      queryClient.clear()
      navigate('/login')
    },
  })
}
