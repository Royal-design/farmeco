import { z } from "zod"

export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),
  title: z
    .string()
    .trim()
    .min(3, "Give your review a short title")
    .max(80, "Title is too long"),
  comment: z
    .string()
    .trim()
    .min(10, "Your review should be at least 10 characters")
    .max(1000, "Your review is too long"),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>
