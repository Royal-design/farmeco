import type { Metadata } from "next"
import { mockRequest } from "@/services/request"

export interface SeoInput {
  title: string
  description: string
  path?: string
  image?: string
  type?: "website" | "article" | "product"
  publishedTime?: string
}

export const seoService = {
  async getMetadata(input: SeoInput): Promise<Metadata> {
    const resolved = await mockRequest(input, 80)
    return {
      title: resolved.title,
      description: resolved.description,
      alternates: {
        canonical: resolved.path ? `${"/"}${resolved.path.replace(/^\/+/, "")}` : "/",
      },
      openGraph: {
        title: resolved.title,
        description: resolved.description,
        url: resolved.path ?? "/",
        type: resolved.type === "article" ? "article" : resolved.type === "product" ? "website" : "website",
        publishedTime: resolved.publishedTime,
        images: resolved.image ? [{ url: resolved.image }] : undefined,
      },
      twitter: {
        title: resolved.title,
        description: resolved.description,
        images: resolved.image ? [resolved.image] : undefined,
      },
    }
  },
}
