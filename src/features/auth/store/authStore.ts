import { create } from 'zustand'

/** Mirror of the BFF's UserResponse (GET /bff/user). Identity claims and realm roles, never a token. */
export interface AuthUser {
  sub: string
  username: string
  name?: string
  givenName?: string
  familyName?: string
  email?: string
  emailVerified?: boolean
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