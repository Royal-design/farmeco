import { z } from "zod"

export const settingsSchema = z.object({
  orderUpdates: z.boolean(),
  priceDrops: z.boolean(),
  newArrivals: z.boolean(),
  weeklyDigest: z.boolean(),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>

export const paymentMethodSchema = z.object({
  number: z
    .string()
    .trim()
    .min(1, "Card number is required")
    .superRefine((value, ctx) => {
      const digits = value.replace(/\s/g, "")
      if (!/^\d{13,19}$/.test(digits)) {
        ctx.addIssue({ code: "custom", message: "Enter a valid card number" })
      }
    }),
  expiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\s?\/\s?([0-9]{2})$/, "Use MM/YY format"),
  cvc: z.string().trim().regex(/^\d{3,4}$/, "Enter a valid CVC"),
})

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>
