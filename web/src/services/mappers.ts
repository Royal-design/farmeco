import type { BlogPost } from "@/types/blog"
import type {
  Category,
  Product,
  ProductBadge,
  ProductReview,
  ProductSpec,
} from "@/types/catalog"
import type { Coupon, Order, OrderItem, ShippingAddress } from "@/types/order"
import type { User, UserRole } from "@/types/user"

// -------------------------
// RAW BACKEND SHAPES
// -------------------------

export interface RawUser {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  role: UserRole
  provider: string
  address: Record<string, string | undefined> | null
  preferences: Record<string, unknown> | null
  is_active: boolean
  is_verified: boolean
  two_factor_enabled: boolean
  created_at: string
  updated_at: string
}

export interface RawCategory {
  id: string
  name: string
  slug: string
  short_description: string
  description: string
  image: string | null
  emoji: string | null
  accent: string | null
  featured: boolean
  product_count: number
}

export interface RawReview {
  id: string
  product_id: string
  author: string
  author_initials: string
  rating: number
  title: string
  comment: string
  helpful_count: number
  created_at: string
}

export interface RawProduct {
  id: string
  slug: string
  name: string
  short_description: string
  description: string
  category_id: string
  price: number | string
  compare_at_price: number | string | null
  currency: string
  unit: string
  stock: number
  sold: number
  rating: number
  review_count: number
  images: string[]
  specs: Array<{ label: string; value: string }>
  tags: string[]
  badges: string[]
  origin: string | null
  farm: string | null
  status: string
  is_active: boolean
  category?: RawCategory | null
  reviews?: RawReview[]
  created_at: string
  updated_at: string
}

export interface RawOrderItem {
  product_id: string
  slug: string
  name: string
  image: string | null
  price: number | string
  quantity: number
}

export interface RawShippingAddress {
  full_name: string
  phone: string
  line1: string
  line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
}

export interface RawOrder {
  id: string
  number: string
  status: Order["status"]
  items: RawOrderItem[]
  subtotal: number | string
  shipping: number | string
  tax: number | string
  discount: number | string
  total: number | string
  payment_method: Order["paymentMethod"]
  coupon_code: string | null
  shipping_address: RawShippingAddress
  notes: string | null
  eta: string | null
  delivered_at: string | null
  created_at: string
  updated_at: string
}

export interface RawCoupon {
  id: string
  code: string
  type: Coupon["type"]
  value: number | string
  min_order: number | string
  description: string | null
  expires_at: string | null
  is_active: boolean
}

export interface RawBlogAuthor {
  name: string
  role: string | null
  avatar: string | null
}

export interface RawBlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string[]
  cover_image: string | null
  category: string
  tags: string[]
  featured: boolean
  read_time: number
  author: RawBlogAuthor
  published_at: string
  created_at: string
}

// -------------------------
// MAPPERS
// -------------------------

export function mapUser(raw: RawUser): User {
  const address = raw.address ?? {}
  const preferences = raw.preferences ?? {}
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    phone: raw.phone ?? undefined,
    role: raw.role,
    avatar: raw.avatar ?? undefined,
    address: {
      line1: address.line1 ?? "",
      city: address.city ?? "",
      state: address.state ?? "",
      postalCode: address.postalCode ?? "",
      country: address.country ?? "",
    },
    joinedAt: raw.created_at.slice(0, 10),
    emailVerified: raw.is_verified,
    preferences: {
      notifications: (preferences.notifications as boolean | undefined) ?? true,
      marketing: (preferences.marketing as boolean | undefined) ?? false,
      currency: (preferences.currency as string | undefined) ?? "NGN",
    },
  }
}

export function mapCategory(raw: RawCategory): Category {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    shortDescription: raw.short_description,
    description: raw.description,
    image: raw.image ?? "",
    emoji: raw.emoji ?? "",
    accent: raw.accent ?? "",
    productCount: raw.product_count,
    featured: raw.featured,
  }
}

export function mapReview(raw: RawReview): ProductReview {
  return {
    id: raw.id,
    author: raw.author,
    authorInitials: raw.author_initials,
    rating: raw.rating,
    title: raw.title,
    comment: raw.comment,
    date: raw.created_at.slice(0, 10),
    helpfulCount: raw.helpful_count,
  }
}

export function mapProduct(raw: RawProduct): Product {
  const specs: ProductSpec[] = Array.isArray(raw.specs)
    ? raw.specs.map((spec) => ({
        label: String(spec.label ?? ""),
        value: String(spec.value ?? ""),
      }))
    : []
  const badges: ProductBadge[] = Array.isArray(raw.badges)
    ? (raw.badges.filter((badge) => isProductBadge(badge)) as ProductBadge[])
    : []

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    shortDescription: raw.short_description,
    description: raw.description,
    categoryId: raw.category_id,
    price: Number(raw.price),
    compareAtPrice: raw.compare_at_price != null ? Number(raw.compare_at_price) : undefined,
    currency: raw.currency,
    unit: raw.unit,
    stock: raw.stock,
    images: raw.images ?? [],
    rating: raw.rating,
    reviewCount: raw.review_count,
    reviews: (raw.reviews ?? []).map(mapReview),
    badges,
    origin: raw.origin ?? "",
    farm: raw.farm ?? "",
    sold: raw.sold,
    createdAt: raw.created_at,
    status: raw.status as Product["status"],
    specs,
    tags: raw.tags ?? [],
  }
}

function isProductBadge(value: string): value is ProductBadge {
  return ["featured", "best-seller", "new", "organic", "sale", "certified", "top"].includes(value)
}

export function mapOrderItem(raw: RawOrderItem): OrderItem {
  return {
    productId: raw.product_id,
    slug: raw.slug,
    name: raw.name,
    image: raw.image ?? "",
    price: Number(raw.price),
    quantity: raw.quantity,
  }
}

export function mapShippingAddress(raw: RawShippingAddress): ShippingAddress {
  return {
    fullName: raw.full_name,
    phone: raw.phone,
    line1: raw.line1,
    line2: raw.line2 ?? undefined,
    city: raw.city,
    state: raw.state,
    postalCode: raw.postal_code,
    country: raw.country,
  }
}

export function mapOrder(raw: RawOrder): Order {
  return {
    id: raw.id,
    number: raw.number,
    status: raw.status,
    items: (raw.items ?? []).map(mapOrderItem),
    subtotal: Number(raw.subtotal),
    shipping: Number(raw.shipping),
    tax: Number(raw.tax),
    discount: Number(raw.discount),
    total: Number(raw.total),
    paymentMethod: raw.payment_method,
    couponCode: raw.coupon_code ?? undefined,
    shippingAddress: mapShippingAddress(raw.shipping_address),
    notes: raw.notes ?? undefined,
    eta: raw.eta ?? undefined,
    deliveredAt: raw.delivered_at ?? undefined,
    createdAt: raw.created_at,
  }
}

export function mapCoupon(raw: RawCoupon): Coupon {
  return {
    id: raw.id,
    code: raw.code,
    type: raw.type,
    value: Number(raw.value),
    minOrder: Number(raw.min_order),
    description: raw.description ?? "",
    expiresAt: raw.expires_at ?? "",
  }
}

export function mapBlogPost(raw: RawBlogPost): BlogPost {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt,
    content: raw.content ?? [],
    coverImage: raw.cover_image ?? "",
    category: raw.category,
    author: {
      name: raw.author.name,
      role: raw.author.role ?? "",
      avatar: raw.author.avatar ?? "",
    },
    publishedAt: raw.published_at,
    readTime: raw.read_time,
    tags: raw.tags ?? [],
    featured: raw.featured,
  }
}
