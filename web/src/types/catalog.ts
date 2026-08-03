export interface Category {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  image: string
  emoji: string
  accent: string
  productCount: number
  featured?: boolean
}

export interface ProductSpec {
  label: string
  value: string
}

export type ProductBadge = "featured" | "best-seller" | "new" | "organic" | "sale" | "certified"

export interface ProductReview {
  id: string
  author: string
  authorInitials: string
  rating: number
  title: string
  comment: string
  date: string
  helpfulCount: number
}

export interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  categoryId: string
  price: number
  compareAtPrice?: number
  currency: string
  unit: string
  stock: number
  images: string[]
  rating: number
  reviewCount: number
  reviews: ProductReview[]
  badges: ProductBadge[]
  origin: string
  farm: string
  sold: number
  createdAt: string
  specs: ProductSpec[]
  tags: string[]
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  avatar: string
  rating: number
}
