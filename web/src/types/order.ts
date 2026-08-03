export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export type PaymentMethod = "card" | "cod" | "bank_transfer"

export interface OrderItem {
  productId: string
  slug: string
  name: string
  image: string
  price: number
  quantity: number
}

export interface ShippingAddress {
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  number: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  paymentMethod: PaymentMethod
  couponCode?: string
  shippingAddress: ShippingAddress
  notes?: string
  createdAt: string
  deliveredAt?: string
  eta?: string
}

export interface Coupon {
  id: string
  code: string
  type: "percent" | "fixed"
  value: number
  minOrder: number
  description: string
  expiresAt: string
}
