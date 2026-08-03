"use client"

import { create } from "zustand"
import type { User } from "@/types/user"
import { authService } from "@/services/auth.service"

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated"

interface AuthState {
  user: User | null
  token: string | null
  status: AuthStatus
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hydrate: () => Promise<void>
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  status: "idle",

  login: async (email, password) => {
    set({ status: "loading" })
    try {
      const session = await authService.login({ email, password })
      set({
        user: session.user,
        token: session.token,
        status: "authenticated",
      })
    } catch (error) {
      set({ status: "unauthenticated" })
      throw error
    }
  },

  register: async (name, email, password) => {
    set({ status: "loading" })
    try {
      const session = await authService.register({ name, email, password })
      set({
        user: session.user,
        token: session.token,
        status: "authenticated",
      })
    } catch (error) {
      set({ status: "unauthenticated" })
      throw error
    }
  },

  logout: async () => {
    await authService.logout()
    set({ user: null, token: null, status: "unauthenticated" })
  },

  hydrate: async () => {
    const session = await authService.getSession()
    if (session) {
      set({
        user: session.user,
        token: session.token,
        status: "authenticated",
      })
    } else {
      set({ user: null, token: null, status: "unauthenticated" })
    }
  },

  setUser: (user) => set({ user }),
}))
