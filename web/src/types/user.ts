export type UserRole = "buyer" | "seller" | "admin"

export interface UserAddress {
  line1: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  avatar?: string
  address?: UserAddress
  joinedAt: string
  emailVerified: boolean
  preferences: {
    notifications: boolean
    marketing: boolean
    currency: string
  }
}

export interface AuthSession {
  user: User
  accessToken: string
  refreshToken: string
  tokenType?: string
}
