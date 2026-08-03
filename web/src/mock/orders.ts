import type { Order } from "@/types/order"
import { currentUser } from "@/mock/users"

const address = {
  fullName: "Avery Collins",
  phone: "+1 (555) 220-1187",
  line1: "18 Willow Lane",
  city: "Greenfield Valley",
  state: "Iowa",
  postalCode: "52101",
  country: "United States",
}

export const mockOrders: Order[] = [
  {
    id: "o1",
    number: "PC-10482",
    status: "delivered",
    items: [
      {
        productId: "p9",
        slug: "isa-brown-pullets",
        name: "ISA Brown Pullets",
        image: "",
        price: 180,
        quantity: 1,
      },
      {
        productId: "p15",
        slug: "pasture-layer-feed-25kg",
        name: "Pasture-Raised Layer Feed (25 kg)",
        image: "",
        price: 38,
        quantity: 2,
      },
    ],
    subtotal: 256,
    shipping: 24,
    tax: 0,
    discount: 38.4,
    total: 241.6,
    paymentMethod: "card",
    couponCode: "WELCOME15",
    shippingAddress: address,
    createdAt: "2026-07-02",
    deliveredAt: "2026-07-09",
  },
  {
    id: "o2",
    number: "PC-10391",
    status: "shipped",
    items: [
      {
        productId: "p17",
        slug: "free-range-brown-eggs",
        name: "Free-Range Brown Eggs (30)",
        image: "",
        price: 14,
        quantity: 2,
      },
      {
        productId: "p18",
        slug: "raw-jersey-cream",
        name: "Raw Jersey Cream",
        image: "",
        price: 9,
        quantity: 4,
      },
    ],
    subtotal: 64,
    shipping: 9,
    tax: 0,
    discount: 0,
    total: 73,
    paymentMethod: "card",
    shippingAddress: address,
    createdAt: "2026-07-19",
    eta: "2026-07-23",
  },
  {
    id: "o3",
    number: "PC-10255",
    status: "processing",
    items: [
      {
        productId: "p4",
        slug: "boer-goat-buck",
        name: "Boer Goat Buck",
        image: "",
        price: 420,
        quantity: 1,
      },
    ],
    subtotal: 420,
    shipping: 60,
    tax: 0,
    discount: 0,
    total: 480,
    paymentMethod: "cod",
    shippingAddress: address,
    createdAt: "2026-07-26",
    eta: "2026-07-30",
  },
  {
    id: "o4",
    number: "PC-10110",
    status: "cancelled",
    items: [
      {
        productId: "p16",
        slug: "organic-alfalfa-bales",
        name: "Organic Alfalfa Bales (30)",
        image: "",
        price: 220,
        quantity: 1,
      },
    ],
    subtotal: 220,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 220,
    paymentMethod: "card",
    shippingAddress: address,
    createdAt: "2026-06-11",
  },
]

export function imageForProduct(slug: string) {
  const lookup: Record<string, string> = {
    "isa-brown-pullets": "🐔",
    "pasture-layer-feed-25kg": "🌾",
    "free-range-brown-eggs": "🥚",
    "raw-jersey-cream": "🥛",
    "boer-goat-buck": "🐐",
    "organic-alfalfa-bales": "🌿",
  }
  return lookup[slug]
}

export function fillOrderImages(order: Order): Order {
  return {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      image: imageForProduct(item.slug) ?? "🐄",
    })),
  }
}
