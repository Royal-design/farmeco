export type NotificationType = "message" | "order" | "payment" | "system"

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string | null
  link: string | null
  isRead: boolean
  createdAt: string
}
