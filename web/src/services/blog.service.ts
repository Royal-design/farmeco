import type { BlogPost } from "@/types/blog"
import type { Paginated, QueryParams } from "@/types/api"
import { blogPosts } from "@/mock/blog"
import { mockRequest, paginateData } from "@/services/request"

export interface BlogQuery extends QueryParams {
  category?: string
  search?: string
  tag?: string
}

export const blogService = {
  async getPosts(params?: BlogQuery): Promise<Paginated<BlogPost>> {
    let result = [...blogPosts]
    if (params?.category && params.category !== "all") {
      result = result.filter((post) => post.category === params.category)
    }
    if (params?.search) {
      const term = params.search.toLowerCase()
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.tags.some((tag) => tag.toLowerCase().includes(term))
      )
    }
    if (params?.tag) {
      result = result.filter((post) => post.tags.includes(params.tag ?? ""))
    }
    return mockRequest(paginateData(result, params))
  },

  async getPost(slug: string): Promise<BlogPost | null> {
    const post = blogPosts.find((p) => p.slug === slug) ?? null
    return mockRequest(post, 250)
  },

  async getFeaturedPost(): Promise<BlogPost | null> {
    const post = blogPosts.find((p) => p.featured) ?? blogPosts[0] ?? null
    return mockRequest(post, 180)
  },

  async getPostCategories(): Promise<string[]> {
    const categories = [...new Set(blogPosts.map((post) => post.category))]
    return mockRequest(categories, 120)
  },

  async createPost(data: Partial<BlogPost>): Promise<BlogPost> {
    const post = {
      ...data,
      id: `b-${Date.now()}`,
      slug: data.slug ?? data.title?.toLowerCase().replace(/\s+/g, "-") ?? "",
    } as BlogPost
    return mockRequest(post, 500)
  },

  async updatePost(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
    return mockRequest(null, 400)
  },

  async deletePost(id: string): Promise<void> {
    await mockRequest(undefined, 300)
  },
}
