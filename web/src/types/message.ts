export type ContactMessageStatus = "new" | "read" | "replied"

export interface ContactMessageSummary {
  id: string
  ticket: string
  name: string
  email: string
  subject: string
  status: ContactMessageStatus
  readAt: string | null
  repliedAt: string | null
  userReadAt: string | null
  createdAt: string
}

export interface ContactMessageDetail extends ContactMessageSummary {
  userId: string | null
  message: string
  adminReply: string | null
  repliedByName: string | null
}
