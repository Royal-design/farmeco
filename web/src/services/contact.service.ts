import { api } from "@/lib/http"

export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
}

export const contactService = {
  async sendMessage(payload: ContactPayload): Promise<{ ticket: string }> {
    const { data } = await api.post<{ ticket: string }>("/contact/messages", payload)
    return { ticket: data.ticket }
  },

  async subscribeNewsletter(email: string): Promise<{ subscribed: boolean }> {
    const { data } = await api.post<{ subscribed: boolean }>(
      "/contact/newsletter/subscribe",
      { email }
    )
    return data
  },
}
