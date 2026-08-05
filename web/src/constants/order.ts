import type { OrderStatus } from "@/types/order"
import type { ProductBadge } from "@/types/catalog"

export const orderStatusMeta: Record<
  OrderStatus,
  { label: string; tone: "neutral" | "info" | "success" | "warning" | "danger" }
> = {
  pending: { label: "Pending", tone: "warning" },
  confirmed: { label: "Confirmed", tone: "info" },
  processing: { label: "Processing", tone: "info" },
  shipped: { label: "Shipped", tone: "neutral" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
}

export const orderStatuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]

export const badgeMeta: Record<ProductBadge, { label: string; tone: string }> = {
  featured: { label: "Featured", tone: "brand" },
  "best-seller": { label: "Best seller", tone: "honey" },
  new: { label: "New", tone: "moss" },
  organic: { label: "Organic", tone: "brand" },
  sale: { label: "Sale", tone: "clay" },
  certified: { label: "Certified", tone: "brand" },
}

export const FREE_SHIPPING_THRESHOLD = 200000
export const SHIPPING_FLAT_RATE = 15000
export const SHIPPING_PERISHABLE_RATE = 5000
