import type { Product, ProductBadge } from "@/types/catalog"
import type { Paginated, QueryParams } from "@/types/api"
import { products } from "@/mock/products"
import { mockRequest, paginateData } from "@/services/request"

export interface ProductQuery extends QueryParams {
  category?: string
  search?: string
  sort?: "newest" | "price-asc" | "price-desc" | "popular" | "rating"
  minPrice?: number
  maxPrice?: number
  rating?: number
  badge?: ProductBadge
  inStock?: boolean
  ids?: string[]
}

export type ProductFilters = Omit<ProductQuery, "page" | "pageSize">

function applyFilters(items: Product[], params?: ProductFilters): Product[] {
  if (!params) {
    return items
  }

  let result = [...items]

  if (params.category && params.category !== "all") {
    result = result.filter((product) => product.categoryId === params.category)
  }

  if (params.ids?.length) {
    result = result.filter((product) => params.ids?.includes(product.id))
  }

  if (params.search) {
    const term = params.search.toLowerCase().trim()
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.tags.some((tag) => tag.toLowerCase().includes(term)) ||
        product.shortDescription.toLowerCase().includes(term)
    )
  }

  if (typeof params.minPrice === "number") {
    result = result.filter((product) => product.price >= (params.minPrice ?? 0))
  }
  if (typeof params.maxPrice === "number") {
    result = result.filter((product) => product.price <= (params.maxPrice ?? Infinity))
  }

  if (typeof params.rating === "number" && params.rating > 0) {
    result = result.filter((product) => product.rating >= (params.rating ?? 0))
  }

  if (params.badge) {
    result = result.filter((product) => product.badges.includes(params.badge ?? "featured"))
  }

  if (params.inStock) {
    result = result.filter((product) => product.stock > 0)
  }

  if (params.sort) {
    switch (params.sort) {
      case "newest":
        result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        break
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "popular":
        result.sort((a, b) => b.sold - a.sold)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
    }
  }

  return result
}

export const productsService = {
  async getProducts(params?: ProductQuery): Promise<Paginated<Product>> {
    const filtered = applyFilters(products, params)
    return mockRequest(paginateData(filtered, params))
  },

  async getProduct(slug: string): Promise<Product | null> {
    const product = products.find((p) => p.slug === slug) ?? null
    return mockRequest(product, 220)
  },

  async getProductById(id: string): Promise<Product | null> {
    const product = products.find((p) => p.id === id) ?? null
    return mockRequest(product, 120)
  },

  async getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
    const related = products
      .filter(
        (p) =>
          p.categoryId === product.categoryId && p.id !== product.id
      )
      .slice(0, limit)
    const popular = products
      .filter((p) => p.id !== product.id)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, limit)
    const list = related.length >= limit ? related : [...related, ...popular].slice(0, limit)
    return mockRequest(list, 220)
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const product: Product = {
      ...data,
      id: `p-${Date.now()}`,
      slug: data.slug ?? data.name?.toLowerCase().replace(/\s+/g, "-") ?? "",
      reviews: [],
      rating: 0,
      reviewCount: 0,
      sold: 0,
      createdAt: new Date().toISOString(),
    } as Product
    return mockRequest(product, 400)
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
    return mockRequest(null, 400)
  },

  async deleteProduct(id: string): Promise<void> {
    await mockRequest(undefined, 300)
  },
}
