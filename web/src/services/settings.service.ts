import { mockRequest } from "@/services/request"

export interface NotificationPreferences {
  orderUpdates: boolean
  priceDrops: boolean
  newArrivals: boolean
  weeklyDigest: boolean
}

export interface SecuritySettings {
  twoFactor: boolean
  sessions: Array<{ id: string; device: string; location: string; active: boolean; lastActive: string }>
}

export interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expiry: string
  isDefault: boolean
}

export const settingsService = {
  async getNotifications(): Promise<NotificationPreferences> {
    return mockRequest(
      {
        orderUpdates: true,
        priceDrops: true,
        newArrivals: false,
        weeklyDigest: true,
      },
      250
    )
  },

  async updateNotifications(
    prefs: NotificationPreferences
  ): Promise<NotificationPreferences> {
    return mockRequest(prefs, 450)
  },

  async getSecurity(): Promise<SecuritySettings> {
    return mockRequest(
      {
        twoFactor: false,
        sessions: [
          { id: "s1", device: "MacBook Pro · Chrome", location: "Des Moines, US", active: true, lastActive: "2026-07-27T09:12:00Z" },
          { id: "s2", device: "iPhone 15 · Safari", location: "Greenfield Valley, US", active: false, lastActive: "2026-07-25T18:40:00Z" },
        ],
      },
      250
    )
  },

  async enableTwoFactor(): Promise<{ qrCode: string; backupCodes: string[] }> {
    return mockRequest(
      {
        qrCode: "mock-qr-data-uri",
        backupCodes: ["ABCD-1234", "EFGH-5678", "IJKL-9012"],
      },
      600
    )
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return mockRequest(
      [
        { id: "pm1", brand: "Visa", last4: "4242", expiry: "09/28", isDefault: true },
        { id: "pm2", brand: "Mastercard", last4: "1881", expiry: "11/27", isDefault: false },
      ],
      250
    )
  },

  async addPaymentMethod(data: { number: string; expiry: string; cvc: string }): Promise<PaymentMethod> {
    await mockRequest(undefined, 600)
    return {
      id: `pm-${Date.now()}`,
      brand: data.number.startsWith("4") ? "Visa" : "Mastercard",
      last4: data.number.slice(-4),
      expiry: data.expiry,
      isDefault: false,
    }
  },
}
