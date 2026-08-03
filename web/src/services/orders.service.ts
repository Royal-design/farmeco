import type { Order, OrderStatus } from "@/types/order"
import type { Paginated, QueryParams } from "@/types/api"
import { mockOrders, fillOrderImages } from "@/mock/orders"
import { mockRequest, paginateData } from "@/services/request"

export interface OrderQuery extends QueryParams {
  status?: OrderStatus | "all"
  search?: string
}

export interface CreateOrderInput {
  items: Array<{ productId: string; quantity: number }>
  paymentMethod: Order["paymentMethod"]
  couponCode?: string
  shippingAddress: Order["shippingAddress"]
  notes?: string
}

function hydrate(orders: Order[]): Order[] {
  return orders.map(fillOrderImages)
}

export const ordersService = {
  async getOrders(params?: OrderQuery): Promise<Paginated<Order>> {
    let result = hydrate(mockOrders)
    if (params?.status && params.status !== "all") {
      result = result.filter((order) => order.status === params.status)
    }
    if (params?.search) {
      const term = params.search.toLowerCase()
      result = result.filter(
        (order) =>
          order.number.toLowerCase().includes(term) ||
          order.items.some((item) => item.name.toLowerCase().includes(term))
      )
    }
    return mockRequest(paginateData(result, params))
  },

  async getOrderById(id: string): Promise<Order | null> {
    const order = mockOrders.find((o) => o.id === id) ?? null
    return mockRequest(order ? fillOrderImages(order) : null, 200)
  },

  async getRecentOrders(limit = 4): Promise<Order[]> {
    return mockRequest(hydrate(mockOrders).slice(0, limit), 200)
  },

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return mockRequest(
      hydrate(mockOrders.filter((o) => o.status === status)),
      200
    )
  },

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const order: Order = {
      id: `o-${Date.now()}`,
      number: `PC-${Math.floor(10000 + Math.random() * 89999)}`,
      status: "pending",
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: 0,
      paymentMethod: input.paymentMethod,
      shippingAddress: input.shippingAddress,
      notes: input.notes,
      couponCode: input.couponCode,
      createdAt: new Date().toISOString(),
    }
    return mockRequest(order, 600)
  },

  async cancelOrder(id: string): Promise<Order | null> {
    return mockRequest(null, 400)
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    return mockRequest(null, 300)
  },
}
