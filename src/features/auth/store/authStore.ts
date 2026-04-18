import { create } from 'zustand'

export interface AuthUser {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  roles: string[]
  createdAt?: string
  lastLoginAt?: string
}

interface AuthState {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
