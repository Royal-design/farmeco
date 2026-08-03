import { mockRequest } from "@/services/request"

export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
}

export const contactService = {
  async sendMessage(payload: ContactPayload): Promise<{ ticket: string }> {
    await mockRequest(undefined, 700)
    return { ticket: `TS-${Math.floor(10000 + Math.random() * 89999)}` }
  },

  async subscribeNewsletter(email: string): Promise<{ subscribed: boolean }> {
    await mockRequest(undefined, 400)
    return { subscribed: true }
  },
}
