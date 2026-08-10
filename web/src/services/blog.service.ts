import type { Paginated, QueryParams } from "@/types/api"
import { toPaginated } from "@/types/api"
import type { BlogPost } from "@/types/blog"
import { api } from "@/lib/http"
import { mapBlogPost, type RawBlogPost } from "@/services/mappers"

export interface BlogQuery extends QueryParams {
  category?: string
  search?: string
  tag?: string
}

export interface BlogPostInput {
  title: string
  excerpt: string
  content: string[]
  category: string
  tags?: string[]
  featured?: boolean
  coverImage?: string
  images?: string[]
}

function toPayload(input: Partial<BlogPostInput>): Record<string, unknown> {
  return {
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    tags: input.tags,
    featured: input.featured,
    cover_image: input.coverImage,
    images: input.images,
  }
}

export const blogService = {
  async getPosts(params?: BlogQuery): Promise<Paginated<BlogPost>> {
    const { data, meta } = await api.get<RawBlogPost[]>("/blog", {
      category: params?.category,
      search: params?.search,
      tag: params?.tag,
      page: params?.page,
      page_size: params?.pageSize,
    })
    return toPaginated(data.map(mapBlogPost), meta)
  },

  async getPost(slug: string): Promise<BlogPost | null> {
    try {
      const { data } = await api.get<RawBlogPost>(`/blog/slug/${slug}`)
      return mapBlogPost(data)
    } catch {
      return null
    }
  },

  async getPostById(id: string): Promise<BlogPost | null> {
    try {
      const { data } = await api.get<RawBlogPost>(`/blog/${id}`)
      return mapBlogPost(data)
    } catch {
      return null
    }
  },

  async getFeaturedPost(): Promise<BlogPost | null> {
    try {
      const { data } = await api.get<RawBlogPost>("/blog/featured")
      return mapBlogPost(data)
    } catch {
      return null
    }
  },

  async getPostCategories(): Promise<string[]> {
    const { data } = await api.get<string[]>("/blog/categories")
    return data
  },

  async createPost(input: BlogPostInput): Promise<BlogPost> {
    const { data } = await api.post<RawBlogPost>("/blog", toPayload(input))
    return mapBlogPost(data)
  },

  async updatePost(id: string, input: Partial<BlogPostInput>): Promise<BlogPost> {
    const { data } = await api.put<RawBlogPost>(`/blog/${id}`, toPayload(input))
    return mapBlogPost(data)
  },

  async deletePost(id: string): Promise<void> {
    await api.delete(`/blog/${id}`)
  },
}
