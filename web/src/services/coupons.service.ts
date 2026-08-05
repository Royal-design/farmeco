import type { Coupon } from "@/types/order"
import { api } from "@/lib/http"
import { mapCoupon, type RawCoupon } from "@/services/mappers"

export interface ValidateCouponResult {
  valid: boolean
  coupon?: Coupon
  message?: string
}

interface RawValidateResult {
  valid: boolean
  coupon?: RawCoupon | null
  message?: string | null
}

export interface CouponInput {
  code: string
  type: Coupon["type"]
  value: number
  minOrder?: number
  description?: string
  expiresAt?: string
  isActive?: boolean
}

function toPayload(input: Partial<CouponInput>): Record<string, unknown> {
  return {
    code: input.code,
    type: input.type,
    value: input.value,
    min_order: input.minOrder,
    description: input.description,
    expires_at: input.expiresAt,
    is_active: input.isActive,
  }
}

export const couponsService = {
  async getCoupons(): Promise<Coupon[]> {
    const { data } = await api.get<RawCoupon[]>("/coupons")
    return data.map(mapCoupon)
  },

  async validateCoupon(code: string, subtotal: number): Promise<ValidateCouponResult> {
    const { data } = await api.post<RawValidateResult>("/coupons/validate", {
      code,
      subtotal,
    })
    return {
      valid: data.valid,
      coupon: data.coupon ? mapCoupon(data.coupon) : undefined,
      message: data.message ?? undefined,
    }
  },

  async createCoupon(input: CouponInput): Promise<Coupon> {
    const { data } = await api.post<RawCoupon>("/coupons", toPayload(input))
    return mapCoupon(data)
  },

  async updateCoupon(id: string, input: Partial<CouponInput>): Promise<Coupon> {
    const { data } = await api.put<RawCoupon>(`/coupons/${id}`, toPayload(input))
    return mapCoupon(data)
  },

  async deleteCoupon(id: string): Promise<void> {
    await api.delete(`/coupons/${id}`)
  },
}
