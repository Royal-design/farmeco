import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  subject: z.string().trim().min(3, "Please add a subject"),
  message: z
    .string()
    .trim()
    .min(10, "Your message should be at least 10 characters")
    .max(2000, "Message is too long"),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export const newsletterSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
})

export type NewsletterFormValues = z.infer<typeof newsletterSchema>
