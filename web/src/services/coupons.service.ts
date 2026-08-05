import type { Coupon } from "@/types/order"
import { mockCoupons } from "@/mock/coupons"
import { mockRequest } from "@/services/request"

export interface ValidateCouponResult {
  valid: boolean
  coupon?: Coupon
  message?: string
}

export const couponsService = {
  async getCoupons(): Promise<Coupon[]> {
    return mockRequest(mockCoupons, 200)
  },

  async validateCoupon(code: string, subtotal: number): Promise<ValidateCouponResult> {
    await mockRequest(undefined, 450)
    const coupon = mockCoupons.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase()
    )
    if (!coupon) {
      return { valid: false, message: "That coupon code doesn't exist." }
    }
    if (new Date(coupon.expiresAt) < new Date()) {
      return { valid: false, message: "This coupon has expired." }
    }
    if (subtotal < coupon.minOrder) {
      return {
        valid: false,
        message: `This coupon requires a minimum order of ₦${coupon.minOrder}.`,
      }
    }
    return { valid: true, coupon }
  },
}
