import type { AuthSession } from "@/types/user"
import { api } from "@/lib/http"
import {
  clearStoredSession,
  getStoredSession,
  setStoredSession,
} from "@/lib/session"
import { mapUser, type RawUser } from "@/services/mappers"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  phone?: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

interface RawAuthPayload {
  user: RawUser
  access_token: string
  refresh_token: string
  token_type: string
}

function toSession(raw: RawAuthPayload): AuthSession {
  const session: AuthSession = {
    user: mapUser(raw.user),
    accessToken: raw.access_token,
    refreshToken: raw.refresh_token,
    tokenType: raw.token_type,
  }
  setStoredSession(session)
  return session
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const { data } = await api.post<RawAuthPayload>("/auth/login", credentials)
    return toSession(data)
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    const { data } = await api.post<RawAuthPayload>("/auth/register", {
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? null,
      password: payload.password,
    })
    return toSession(data)
  },

  async googleLogin(accessToken: string): Promise<AuthSession> {
    const { data } = await api.post<RawAuthPayload>("/auth/google", {
      access_token: accessToken,
    })
    return toSession(data)
  },

  async getSession(): Promise<AuthSession | null> {
    const stored = getStoredSession()
    if (!stored) {
      return null
    }
    return {
      user: stored.user,
      accessToken: stored.accessToken,
      refreshToken: stored.refreshToken,
    }
  },

  async logout(): Promise<void> {
    const stored = getStoredSession()
    try {
      await api.post("/auth/logout", stored ? { refresh_token: stored.refreshToken } : undefined)
    } catch {
      // ignore — the session is always cleared locally
    }
    clearStoredSession()
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ sentTo: string }> {
    await api.post("/auth/forgot-password", { email: payload.email })
    return { sentTo: payload.email }
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await api.post("/auth/reset-password", {
      token: payload.token,
      new_password: payload.password,
    })
  },
}
