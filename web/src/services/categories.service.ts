import type { Category } from "@/types/catalog"
import type { Paginated, QueryParams } from "@/types/api"
import { categories } from "@/mock/categories"
import { mockRequest, paginateData } from "@/services/request"

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    return mockRequest(categories, 200)
  },

  async getFeaturedCategories(): Promise<Category[]> {
    return mockRequest(categories.filter((c) => c.featured), 160)
  },

  async getCategory(slug: string): Promise<Category | null> {
    const category = categories.find((c) => c.slug === slug) ?? null
    return mockRequest(category, 200)
  },

  async getCategoryById(id: string): Promise<Category | null> {
    const category = categories.find((c) => c.id === id) ?? null
    return mockRequest(category, 120)
  },

  async getCategoriesPage(params?: QueryParams): Promise<Paginated<Category>> {
    return mockRequest(paginateData(categories, params))
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const category = {
      ...data,
      id: `cat-${Date.now()}`,
      productCount: 0,
    } as Category
    return mockRequest(category, 400)
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
    return mockRequest(null, 400)
  },

  async deleteCategory(id: string): Promise<void> {
    await mockRequest(undefined, 300)
  },
}
