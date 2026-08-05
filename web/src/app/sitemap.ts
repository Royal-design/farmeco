import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"
import { productsService } from "@/services/products.service"
import { blogService } from "@/services/blog.service"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ]

  const routes: MetadataRoute.Sitemap = [...staticRoutes]

  try {
    const products = await productsService.getProducts({ pageSize: 100 })
    routes.push(
      ...products.items.map((product) => ({
        url: `${baseUrl}/shop/${product.slug}`,
        lastModified: new Date(product.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    )
  } catch {
    // skip dynamic product routes if the API is unreachable
  }

  try {
    const posts = await blogService.getPosts({ pageSize: 100 })
    routes.push(
      ...posts.items.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    )
  } catch {
    // skip dynamic blog routes if the API is unreachable
  }

  return routes
}
