import type { Paginated, QueryParams } from "@/types/api"
import { toPaginated } from "@/types/api"
import type { Order, OrderStatus, ShippingAddress } from "@/types/order"
import { api } from "@/lib/http"
import { mapOrder, type RawOrder } from "@/services/mappers"

export interface OrderQuery extends QueryParams {
  status?: OrderStatus | "all"
  search?: string
}

export interface CreateOrderInput {
  items: Array<{ productId: string; quantity: number }>
  paymentMethod: Order["paymentMethod"]
  couponCode?: string
  shippingAddress: ShippingAddress
  notes?: string
}

export const ordersService = {
  async getOrders(params?: OrderQuery): Promise<Paginated<Order>> {
    const { data, meta } = await api.get<RawOrder[]>("/orders", {
      status: params?.status && params.status !== "all" ? params.status : undefined,
      search: params?.search,
      page: params?.page,
      page_size: params?.pageSize,
    })
    return toPaginated(data.map(mapOrder), meta)
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data } = await api.get<RawOrder>(`/orders/${id}`)
      return mapOrder(data)
    } catch {
      return null
    }
  },

  async getRecentOrders(limit = 4): Promise<Order[]> {
    const { data } = await api.get<RawOrder[]>("/orders/recent", { limit })
    return data.map(mapOrder)
  },

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const { data } = await api.get<RawOrder[]>("/orders", { status, page_size: 100 })
    return data.map(mapOrder)
  },

  async getAdminOrders(params?: OrderQuery): Promise<Paginated<Order>> {
    const { data, meta } = await api.get<RawOrder[]>("/orders/all", {
      status: params?.status && params.status !== "all" ? params.status : undefined,
      search: params?.search,
      page: params?.page,
      page_size: params?.pageSize,
    })
    return toPaginated(data.map(mapOrder), meta)
  },

  async getSellerOrders(params?: OrderQuery): Promise<Paginated<Order>> {
    const { data, meta } = await api.get<RawOrder[]>("/orders/seller", {
      status: params?.status && params.status !== "all" ? params.status : undefined,
      search: params?.search,
      page: params?.page,
      page_size: params?.pageSize,
    })
    return toPaginated(data.map(mapOrder), meta)
  },

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const { data } = await api.post<RawOrder>("/orders", {
      items: input.items,
      payment_method: input.paymentMethod,
      coupon_code: input.couponCode ?? null,
      shipping_address: {
        full_name: input.shippingAddress.fullName,
        phone: input.shippingAddress.phone,
        line1: input.shippingAddress.line1,
        line2: input.shippingAddress.line2 ?? null,
        city: input.shippingAddress.city,
        state: input.shippingAddress.state,
        postal_code: input.shippingAddress.postalCode,
        country: input.shippingAddress.country,
      },
      notes: input.notes ?? null,
    })
    return mapOrder(data)
  },

  async cancelOrder(id: string): Promise<Order> {
    const { data } = await api.post<RawOrder>(`/orders/${id}/cancel`)
    return mapOrder(data)
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data } = await api.patch<RawOrder>(`/orders/${id}/status`, { status })
    return mapOrder(data)
  },
}
