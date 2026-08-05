import type { Paginated, QueryParams } from "@/types/api"
import { toPaginated } from "@/types/api"
import type { Product, ProductBadge } from "@/types/catalog"
import { api } from "@/lib/http"
import { mapProduct, type RawProduct } from "@/services/mappers"

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
  sellerId?: string
}

export type ProductFilters = Omit<ProductQuery, "page" | "pageSize">

export type ProductStatus = "draft" | "published" | "archived"

export interface ProductInput {
  name: string
  shortDescription: string
  description: string
  categoryId: string
  price: number
  compareAtPrice?: number
  currency?: string
  unit?: string
  stock?: number
  origin?: string
  farm?: string
  images?: string[]
  specs?: Array<{ label: string; value: string }>
  tags?: string[]
  badges?: ProductBadge[]
  status?: ProductStatus
}

function toPayload(input: Partial<ProductInput>): Record<string, unknown> {
  return {
    name: input.name,
    short_description: input.shortDescription,
    description: input.description,
    category_id: input.categoryId,
    price: input.price,
    compare_at_price: input.compareAtPrice ?? null,
    currency: input.currency,
    unit: input.unit,
    stock: input.stock,
    origin: input.origin,
    farm: input.farm,
    images: input.images,
    specs: input.specs,
    tags: input.tags,
    badges: input.badges,
    status: input.status,
  }
}

export const productsService = {
  async getProducts(params?: ProductQuery): Promise<Paginated<Product>> {
    const { data, meta } = await api.get<RawProduct[]>("/products", {
      category: params?.category,
      search: params?.search,
      sort: params?.sort,
      min_price: params?.minPrice,
      max_price: params?.maxPrice,
      rating: params?.rating,
      badge: params?.badge,
      in_stock: params?.inStock || undefined,
      ids: params?.ids?.length ? params.ids : undefined,
      seller_id: params?.sellerId,
      page: params?.page,
      page_size: params?.pageSize,
    })
    return toPaginated(data.map(mapProduct), meta)
  },

  async getProduct(slug: string): Promise<Product | null> {
    try {
      const { data } = await api.get<RawProduct>(`/products/slug/${slug}`)
      return mapProduct(data)
    } catch {
      return null
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data } = await api.get<RawProduct>(`/products/${id}`)
      return mapProduct(data)
    } catch {
      return null
    }
  },

  async getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
    const { data } = await api.get<RawProduct[]>(`/products/related/${product.id}`, {
      limit,
    })
    return data.map(mapProduct)
  },

  async createProduct(input: ProductInput): Promise<Product> {
    const { data } = await api.post<RawProduct>("/products", toPayload(input))
    return mapProduct(data)
  },

  async updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
    const { data } = await api.put<RawProduct>(`/products/${id}`, toPayload(input))
    return mapProduct(data)
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },

  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData()
    files.forEach((file) => formData.append("files", file))
    const { data } = await api.upload<Array<{ url: string; public_id: string }>>(
      "/uploads/images",
      formData
    )
    return data.map((image) => image.url)
  },
}
