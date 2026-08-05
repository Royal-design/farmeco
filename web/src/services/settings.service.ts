import { api } from "@/lib/http"

export interface NotificationPreferences {
  orderUpdates: boolean
  priceDrops: boolean
  newArrivals: boolean
  weeklyDigest: boolean
}

export interface SecuritySettings {
  twoFactor: boolean
  sessions: Array<{
    id: string
    device: string
    location: string
    active: boolean
    lastActive: string
  }>
}

export interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expiry: string
  isDefault: boolean
}

interface RawNotifications {
  order_updates: boolean
  price_drops: boolean
  new_arrivals: boolean
  weekly_digest: boolean
}

interface RawSecuritySession {
  id: string
  device: string | null
  location: string | null
  active: boolean
  last_active: string
}

interface RawSecurity {
  two_factor: boolean
  sessions: RawSecuritySession[]
}

interface RawPaymentMethod {
  id: string
  brand: string
  last4: string
  expiry: string
  is_default: boolean
}

function toNotificationPayload(prefs: NotificationPreferences): RawNotifications {
  return {
    order_updates: prefs.orderUpdates,
    price_drops: prefs.priceDrops,
    new_arrivals: prefs.newArrivals,
    weekly_digest: prefs.weeklyDigest,
  }
}

function mapNotifications(raw: RawNotifications): NotificationPreferences {
  return {
    orderUpdates: raw.order_updates,
    priceDrops: raw.price_drops,
    newArrivals: raw.new_arrivals,
    weeklyDigest: raw.weekly_digest,
  }
}

function mapPaymentMethod(raw: RawPaymentMethod): PaymentMethod {
  return {
    id: raw.id,
    brand: raw.brand,
    last4: raw.last4,
    expiry: raw.expiry,
    isDefault: raw.is_default,
  }
}

export const settingsService = {
  async getNotifications(): Promise<NotificationPreferences> {
    const { data } = await api.get<RawNotifications>("/account/settings/notifications")
    return mapNotifications(data)
  },

  async updateNotifications(prefs: NotificationPreferences): Promise<NotificationPreferences> {
    const { data } = await api.put<RawNotifications>(
      "/account/settings/notifications",
      toNotificationPayload(prefs)
    )
    return mapNotifications(data)
  },

  async getSecurity(): Promise<SecuritySettings> {
    const { data } = await api.get<RawSecurity>("/account/settings/security")
    return {
      twoFactor: data.two_factor,
      sessions: data.sessions.map((session) => ({
        id: session.id,
        device: session.device ?? "Unknown device",
        location: session.location ?? "Unknown location",
        active: session.active,
        lastActive: session.last_active,
      })),
    }
  },

  async enableTwoFactor(): Promise<{ qrCode: string; backupCodes: string[] }> {
    await api.put("/account/settings/security/two-factor", { enabled: true })
    return { qrCode: "", backupCodes: [] }
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const { data } = await api.get<RawPaymentMethod[]>("/account/payment-methods")
    return data.map(mapPaymentMethod)
  },

  async addPaymentMethod(input: { number: string; expiry: string; cvc: string }): Promise<PaymentMethod> {
    const { data } = await api.post<RawPaymentMethod>("/account/payment-methods", {
      number: input.number,
      expiry: input.expiry,
    })
    return mapPaymentMethod(data)
  },
}
