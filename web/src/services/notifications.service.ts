import type { Paginated, QueryParams } from "@/types/api"
import { toPaginated } from "@/types/api"
import type { AppNotification, NotificationType } from "@/types/notification"
import { api } from "@/lib/http"

interface RawNotification {
  id: string
  type: NotificationType
  title: string
  body: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

function mapNotification(raw: RawNotification): AppNotification {
  return {
    id: raw.id,
    type: raw.type,
    title: raw.title,
    body: raw.body,
    link: raw.link,
    isRead: raw.is_read,
    createdAt: raw.created_at,
  }
}

export const notificationsService = {
  async getNotifications(params?: QueryParams): Promise<Paginated<AppNotification>> {
    const { data, meta } = await api.get<RawNotification[]>("/notifications", {
      page: params?.page,
      page_size: params?.pageSize,
    })
    return toPaginated(data.map(mapNotification), meta)
  },

  async getUnreadCount(): Promise<number> {
    const { data } = await api.get<{ count: number }>("/notifications/unread-count")
    return data.count
  },

  async markRead(id: string): Promise<AppNotification> {
    const { data } = await api.patch<RawNotification>(`/notifications/${id}/read`)
    return mapNotification(data)
  },

  async markAllRead(): Promise<void> {
    await api.patch("/notifications/read-all")
  },
}
