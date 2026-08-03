import { z } from "zod"

export const productSchema = z.object({
  name: z.string().trim().min(3, "Product name is required").max(120, "Name is too long"),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Add a short description")
    .max(180, "Short description is too long"),
  description: z.string().trim().min(30, "Add a detailed description"),
  categoryId: z.string().min(1, "Select a category"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal(0)),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  unit: z.string().trim().min(1, "Unit is required"),
  origin: z.string().trim().min(2, "Origin is required"),
  tags: z.string().trim().optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name is required").max(60, "Name is too long"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens"),
  shortDescription: z.string().trim().min(10, "Add a short description"),
  description: z.string().trim().min(20, "Add a description"),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

export const blogSchema = z.object({
  title: z.string().trim().min(5, "Title is required").max(160, "Title is too long"),
  excerpt: z.string().trim().min(20, "Excerpt must be at least 20 characters"),
  category: z.string().min(1, "Select a category"),
  tags: z.string().trim().optional(),
  content: z.string().trim().min(50, "Write at least a few paragraphs"),
  coverImage: z.string().optional(),
})

export type BlogFormValues = z.infer<typeof blogSchema>
