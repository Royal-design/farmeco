import { z } from "zod"

export const settingsSchema = z.object({
  orderUpdates: z.boolean(),
  priceDrops: z.boolean(),
  newArrivals: z.boolean(),
  weeklyDigest: z.boolean(),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>
