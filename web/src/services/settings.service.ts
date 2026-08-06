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
}
