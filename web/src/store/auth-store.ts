"use client"

import { create } from "zustand"

import type { User } from "@/types/user"
import { authService } from "@/services/auth.service"
import { clearStoredSession, getStoredSession, updateStoredUser } from "@/lib/session"

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated"

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  status: AuthStatus
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  googleLogin: (accessToken: string) => Promise<void>
  logout: () => Promise<void>
  hydrate: () => Promise<void>
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle",

  login: async (email, password) => {
    set({ status: "loading" })
    try {
      const session = await authService.login({ email, password })
      set({
        user: session.user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        status: "authenticated",
      })
    } catch (error) {
      set({ status: "unauthenticated" })
      throw error
    }
  },

  register: async (name, email, password, phone) => {
    set({ status: "loading" })
    try {
      const session = await authService.register({ name, email, password, phone })
      set({
        user: session.user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        status: "authenticated",
      })
    } catch (error) {
      set({ status: "unauthenticated" })
      throw error
    }
  },

  googleLogin: async (accessToken) => {
    set({ status: "loading" })
    try {
      const session = await authService.googleLogin(accessToken)
      set({
        user: session.user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        status: "authenticated",
      })
    } catch (error) {
      set({ status: "unauthenticated" })
      throw error
    }
  },

  logout: async () => {
    try {
      await authService.logout()
    } catch {
      // still clear locally
    }
    clearStoredSession()
    set({ user: null, accessToken: null, refreshToken: null, status: "unauthenticated" })
  },

  hydrate: async () => {
    const session = getStoredSession()
    if (session) {
      set({
        user: session.user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        status: "authenticated",
      })
    } else {
      set({ user: null, accessToken: null, refreshToken: null, status: "unauthenticated" })
    }
  },

  setUser: (user) => {
    updateStoredUser(user)
    set({ user })
  },
}))
