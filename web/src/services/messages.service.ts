import type { Paginated, QueryParams } from "@/types/api"
import { toPaginated } from "@/types/api"
import type {
  ContactMessageDetail,
  ContactMessageStatus,
  ContactMessageSummary,
} from "@/types/message"
import { api } from "@/lib/http"

interface RawMessageSummary {
  id: string
  ticket: string
  name: string
  email: string
  subject: string
  status: ContactMessageStatus
  read_at: string | null
  replied_at: string | null
  user_read_at: string | null
  created_at: string
}

interface RawMessageDetail extends RawMessageSummary {
  user_id: string | null
  message: string
  admin_reply: string | null
  replied_by_name: string | null
}

export interface MessagesQuery extends QueryParams {
  status?: ContactMessageStatus | "all"
  search?: string
}

function mapSummary(raw: RawMessageSummary): ContactMessageSummary {
  return {
    id: raw.id,
    ticket: raw.ticket,
    name: raw.name,
    email: raw.email,
    subject: raw.subject,
    status: raw.status,
    readAt: raw.read_at,
    repliedAt: raw.replied_at,
    userReadAt: raw.user_read_at,
    createdAt: raw.created_at,
  }
}

function mapDetail(raw: RawMessageDetail): ContactMessageDetail {
  return {
    ...mapSummary(raw),
    userId: raw.user_id,
    message: raw.message,
    adminReply: raw.admin_reply,
    repliedByName: raw.replied_by_name,
  }
}

export const messagesService = {
  async getMyMessages(params?: MessagesQuery): Promise<Paginated<ContactMessageSummary>> {
    const { data, meta } = await api.get<RawMessageSummary[]>("/contact/messages/my", {
      status: params?.status && params.status !== "all" ? params.status : undefined,
      page: params?.page,
      page_size: params?.pageSize,
    })
    return toPaginated(data.map(mapSummary), meta)
  },

  async getMessages(params?: MessagesQuery): Promise<Paginated<ContactMessageSummary>> {
    const { data, meta } = await api.get<RawMessageSummary[]>("/contact/messages", {
      status: params?.status && params.status !== "all" ? params.status : undefined,
      search: params?.search,
      page: params?.page,
      page_size: params?.pageSize,
    })
    return toPaginated(data.map(mapSummary), meta)
  },

  async getMessage(id: string): Promise<ContactMessageDetail | null> {
    try {
      const { data } = await api.get<RawMessageDetail>(`/contact/messages/${id}`)
      return mapDetail(data)
    } catch {
      return null
    }
  },

  async markRead(id: string): Promise<ContactMessageDetail> {
    const { data } = await api.patch<RawMessageDetail>(`/contact/messages/${id}/read`)
    return mapDetail(data)
  },

  async reply(id: string, reply: string): Promise<ContactMessageDetail> {
    const { data } = await api.post<RawMessageDetail>(`/contact/messages/${id}/reply`, {
      reply,
    })
    return mapDetail(data)
  },
}
