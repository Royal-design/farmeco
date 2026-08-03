import { z } from "zod"

export const shippingSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number is required")
    .regex(/^[+\d][\d\s().-]{6,18}$/, "Enter a valid phone number"),
  line1: z.string().trim().min(3, "Street address is required"),
  line2: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State / region is required"),
  postalCode: z.string().trim().min(3, "Postal code is required"),
  country: z.string().trim().min(2, "Country is required"),
  saveAddress: z.boolean().optional(),
})

export type ShippingFormValues = z.infer<typeof shippingSchema>

export const paymentSchema = z.object({
  method: z.enum(["card", "cod", "bank_transfer"], {
    message: "Select a payment method",
  }),
  cardNumber: z
    .string()
    .optional()
    .superRefine((value, ctx) => {
      if (value) {
        const digits = value.replace(/\s/g, "")
        if (!/^\d{13,19}$/.test(digits)) {
          ctx.addIssue({ code: "custom", message: "Enter a valid card number" })
        }
      }
    }),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  saveCard: z.boolean().optional(),
  billingSameAsShipping: z.boolean().optional(),
})

export type PaymentFormValues = z.infer<typeof paymentSchema>

export const checkoutSchema = z.object({
  shipping: shippingSchema,
  payment: paymentSchema,
  couponCode: z.string().trim().optional(),
  notes: z.string().max(500, "Notes are too long").optional(),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>

export const couponSchema = z.object({
  code: z.string().trim().min(2, "Enter a coupon code"),
})

export type CouponFormValues = z.infer<typeof couponSchema>
