import type { ProductBadge } from "@/types/catalog"
import { priceBounds } from "@/constants/sorting"

export interface MarketplaceFilters {
  category: string
  search: string
  sort: string
  minPrice: number
  maxPrice: number
  rating: number
  inStock: boolean
  badge: ProductBadge | ""
  page: number
}

export const defaultFilters: MarketplaceFilters = {
  category: "all",
  search: "",
  sort: "popular",
  minPrice: priceBounds.min,
  maxPrice: priceBounds.max,
  rating: 0,
  inStock: false,
  badge: "",
  page: 1,
}

export const ratingOptions = [
  { value: 4, label: "4.0 & up" },
  { value: 3, label: "3.0 & up" },
  { value: 2, label: "2.0 & up" },
]

export const badgeOptions: Array<{ value: ProductBadge; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "best-seller", label: "Best sellers" },
  { value: "new", label: "New arrivals" },
  { value: "organic", label: "Organic" },
  { value: "sale", label: "On sale" },
  { value: "certified", label: "Certified" },
  { value: "top", label: "Top" },
]
