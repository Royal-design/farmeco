import type { User } from "@/types/user"

const SESSION_KEY = "farmeco.session"

export interface StoredSession {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt?: string
}

export function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null
  }
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) {
      return null
    }
    const session = JSON.parse(raw) as StoredSession
    if (session.expiresAt && new Date(session.expiresAt) <= new Date()) {
      window.localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function setStoredSession(session: StoredSession): void {
  if (typeof window === "undefined") {
    return
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function updateStoredUser(user: User): void {
  const session = getStoredSession()
  if (session) {
    setStoredSession({ ...session, user })
  }
}

export function updateStoredTokens(accessToken: string, refreshToken: string): void {
  const session = getStoredSession()
  if (session) {
    setStoredSession({ ...session, accessToken, refreshToken })
  }
}

export function getStoredTokens(): { accessToken?: string; refreshToken?: string } {
  const session = getStoredSession()
  return {
    accessToken: session?.accessToken,
    refreshToken: session?.refreshToken,
  }
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") {
    return
  }
  window.localStorage.removeItem(SESSION_KEY)
}
