"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

import type { Order } from "@/types/order"
import { formatDate, formatPrice } from "@/utils/format"
import { OrderStatusBadge } from "@/features/dashboard/components/order-status-badge"

interface OrderCardProps {
  order: Order
  href: string
}

function OrderCard({ order, href }: OrderCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-lift"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{order.number}</span>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{formatDate(order.createdAt)}</span>
          {order.eta && <span>· ETA {formatDate(order.eta)}</span>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {order.items.slice(0, 4).map((item) => (
            <span
              key={item.productId}
              className="flex size-11 items-center justify-center overflow-hidden rounded-full border-2 border-card bg-muted text-lg"
            >
              <img src={item.image} alt="" className="size-full object-cover" />
            </span>
          ))}
        </div>
        <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
          {order.items.map((item) => item.name).join(", ")}
        </span>
        <span className="text-sm font-semibold tabular-nums">
          {formatPrice(order.total)}
        </span>
        <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

export { OrderCard }
