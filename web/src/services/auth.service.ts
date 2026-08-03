import type { AuthSession, User } from "@/types/user"
import { currentUser, mockUsers } from "@/mock/users"
import { mockRequest } from "@/services/request"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

const SESSION_KEY = "pasture.session"

function buildSession(user: User): AuthSession {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  return {
    user,
    token: `mock-token-${user.id}-${Date.now()}`,
    expiresAt,
  }
}

function persistSession(session: AuthSession) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }
  return session
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await mockRequest(undefined, 650)
    if (!credentials.email.includes("@")) {
      throw new Error("Invalid email address.")
    }
    if (credentials.password.length < 6) {
      throw new Error("Invalid email or password.")
    }
    return persistSession(buildSession(currentUser))
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    await mockRequest(undefined, 800)
    const user: User = {
      ...currentUser,
      id: `u-${Date.now()}`,
      name: payload.name,
      email: payload.email,
    }
    return persistSession(buildSession(user))
  },

  async getSession(): Promise<AuthSession | null> {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(SESSION_KEY)
      if (raw) {
        try {
          const session = JSON.parse(raw) as AuthSession
          if (new Date(session.expiresAt) > new Date()) {
            return session
          }
          window.localStorage.removeItem(SESSION_KEY)
        } catch {
          window.localStorage.removeItem(SESSION_KEY)
        }
      }
    }
    return null
  },

  async logout(): Promise<void> {
    await mockRequest(undefined, 200)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SESSION_KEY)
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ sentTo: string }> {
    await mockRequest(undefined, 600)
    return { sentTo: payload.email }
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await mockRequest(undefined, 600)
    if (!payload.token) {
      throw new Error("Reset token is invalid or has expired.")
    }
  },
}

export { mockUsers }
