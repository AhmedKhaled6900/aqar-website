'use client'

import { create } from 'zustand'
import type { User } from '@/lib/types'

interface AuthState {
  user: User | null
  permissions: string[]
  isHydrated: boolean
  setSession: (user: User, permissions: string[]) => void
  clearSession: () => void
  setHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  permissions: [],
  isHydrated: false,
  setSession: (user, permissions) => set({ user, permissions, isHydrated: true }),
  clearSession: () => set({ user: null, permissions: [], isHydrated: true }),
  setHydrated: (value) => set({ isHydrated: value }),
}))
