"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeftIcon, MapPinIcon, TruckIcon, CreditCardIcon } from "lucide-react"

import { ordersService } from "@/services/orders.service"
import { formatDate, formatPrice } from "@/utils/format"
import { OrderStatusBadge } from "@/features/dashboard/components/order-status-badge"
import { OrderProgress } from "@/features/dashboard/components/order-progress"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderDetailProps {
  orderId: string
}

const paymentLabels = {
  card: "Card",
  cod: "Cash on delivery",
  bank_transfer: "Bank transfer",
} as const

function OrderDetail({ orderId }: OrderDetailProps) {
  const router = useRouter()

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersService.getOrderById(orderId),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col gap-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-medium">Order not found</h1>
        <Link href="/account/orders" className="text-sm font-medium text-brand hover:underline">
          Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => router.push("/account/orders")}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeftIcon className="size-4" />
        All orders
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight">{order.number}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {formatDate(order.createdAt)}
            {order.eta && <> · ETA {formatDate(order.eta)}</>}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <OrderProgress order={order} />

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <ul className="divide-y divide-border">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 p-4">
                  <span className="size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <img src={item.image} alt="" className="size-full object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="line-clamp-1 text-sm font-medium hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t bg-muted/30 p-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground tabular-nums">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-foreground tabular-nums">{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-brand">
                  <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                  <span className="tabular-nums">−{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-medium">
              <MapPinIcon className="size-4 text-brand" />
              Delivery address
            </h2>
            <div className="text-sm leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-medium">
              <CreditCardIcon className="size-4 text-brand" />
              Payment
            </h2>
            <p className="text-sm text-muted-foreground">{paymentLabels[order.paymentMethod]}</p>
          </div>

          {order.notes && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-2 flex items-center gap-2 font-heading text-base font-medium">
                <TruckIcon className="size-4 text-brand" />
                Delivery notes
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { OrderDetail }
