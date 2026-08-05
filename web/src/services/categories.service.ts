import type { Category } from "@/types/catalog"
import { api } from "@/lib/http"
import { mapCategory, type RawCategory } from "@/services/mappers"

export interface CategoryInput {
  name: string
  slug?: string
  shortDescription: string
  description: string
  image?: string
  emoji?: string
  accent?: string
  featured?: boolean
}

function toPayload(input: Partial<CategoryInput>): Record<string, unknown> {
  return {
    name: input.name,
    slug: input.slug,
    short_description: input.shortDescription,
    description: input.description,
    image: input.image,
    emoji: input.emoji,
    accent: input.accent,
    featured: input.featured,
  }
}

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get<RawCategory[]>("/categories")
    return data.map(mapCategory)
  },

  async getCategoriesSorted(
    sort: "newest" | "oldest" | "name"
  ): Promise<Category[]> {
    const { data } = await api.get<RawCategory[]>("/categories", { sort })
    return data.map(mapCategory)
  },

  async getFeaturedCategories(): Promise<Category[]> {
    const { data } = await api.get<RawCategory[]>("/categories/featured")
    return data.map(mapCategory)
  },

  async getCategory(slug: string): Promise<Category | null> {
    try {
      const { data } = await api.get<RawCategory>(`/categories/slug/${slug}`)
      return mapCategory(data)
    } catch {
      return null
    }
  },

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data } = await api.get<RawCategory>(`/categories/${id}`)
      return mapCategory(data)
    } catch {
      return null
    }
  },

  async createCategory(input: CategoryInput): Promise<Category> {
    const { data } = await api.post<RawCategory>("/categories", toPayload(input))
    return mapCategory(data)
  },

  async updateCategory(id: string, input: Partial<CategoryInput>): Promise<Category> {
    const { data } = await api.put<RawCategory>(`/categories/${id}`, toPayload(input))
    return mapCategory(data)
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`)
  },
}
