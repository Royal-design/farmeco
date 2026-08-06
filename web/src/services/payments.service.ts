import type { Order, PaymentStatus } from "@/types/order"
import { api } from "@/lib/http"
import { mapOrder, type RawOrder } from "@/services/mappers"

interface RawPaymentVerify {
  order: RawOrder
  payment_status: PaymentStatus
}

export interface PaymentInitializeResult {
  authorizationUrl: string
  reference: string
}

export const paymentsService = {
  async initialize(orderId: string): Promise<PaymentInitializeResult> {
    const { data } = await api.post<{
      authorization_url: string
      reference: string
    }>("/payments/initialize", { order_id: orderId })
    return {
      authorizationUrl: data.authorization_url,
      reference: data.reference,
    }
  },

  async verify(reference: string): Promise<{ order: Order; paymentStatus: PaymentStatus }> {
    const { data } = await api.get<RawPaymentVerify>(`/payments/verify/${reference}`)
    return {
      order: mapOrder(data.order),
      paymentStatus: data.payment_status,
    }
  },
}
