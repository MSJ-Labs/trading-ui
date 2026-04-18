import { create } from 'zustand'

export interface AuthUser {
  id: string
  username: string
  email: string
  roles: string[]
}

interface AuthState {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
