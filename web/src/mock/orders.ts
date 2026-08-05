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
        price: 55000,
        quantity: 1,
      },
      {
        productId: "p15",
        slug: "pasture-layer-feed-25kg",
        name: "Pasture-Raised Layer Feed (25 kg)",
        image: "",
        price: 32000,
        quantity: 2,
      },
    ],
    subtotal: 119000,
    shipping: 15000,
    tax: 0,
    discount: 17850,
    total: 116150,
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
        price: 9000,
        quantity: 2,
      },
      {
        productId: "p18",
        slug: "raw-jersey-cream",
        name: "Raw Jersey Cream",
        image: "",
        price: 6000,
        quantity: 4,
      },
    ],
    subtotal: 42000,
    shipping: 5000,
    tax: 0,
    discount: 0,
    total: 47000,
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
        price: 180000,
        quantity: 1,
      },
    ],
    subtotal: 180000,
    shipping: 20000,
    tax: 0,
    discount: 0,
    total: 200000,
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
        price: 120000,
        quantity: 1,
      },
    ],
    subtotal: 120000,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 120000,
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
