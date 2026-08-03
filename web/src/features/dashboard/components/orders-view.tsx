"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { PackageSearchIcon } from "lucide-react"

import type { OrderStatus } from "@/types/order"
import { ordersService } from "@/services/orders.service"
import { orderStatuses, orderStatusMeta } from "@/constants/order"
import { cn } from "@/lib/utils"
import { OrderCard } from "@/features/dashboard/components/order-card"
import { EmptyState } from "@/components/ui/empty-state"
import { ButtonLink } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const tabs: Array<{ value: OrderStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  ...orderStatuses.map((status) => ({
    value: status,
    label: orderStatusMeta[status].label,
  })),
]

function OrdersView() {
  const [status, setStatus] = React.useState<OrderStatus | "all">("all")

  const { data, isLoading } = useQuery({
    queryKey: ["orders", status],
    queryFn: () => ordersService.getOrders({ status, pageSize: 50 }),
  })

  const items = data?.items ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-medium tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Track every order from purchase to your gate.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Order status"
        className="flex gap-1.5 overflow-x-auto pb-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={status === tab.value}
            onClick={() => setStatus(tab.value)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              status === tab.value
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border text-muted-foreground hover:border-brand/30 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="flex flex-col gap-3">
          {items.map((order) => (
            <OrderCard key={order.id} order={order} href={`/account/orders/${order.id}`} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PackageSearchIcon}
          title="No orders here yet"
          description={
            status === "all"
              ? "When you place an order it will appear in this list."
              : `You don't have any ${orderStatusMeta[status].label.toLowerCase()} orders right now.`
          }
          action={
            <ButtonLink href="/shop">
              Browse marketplace
            </ButtonLink>
          }
        />
      )}
    </div>
  )
}

export { OrdersView }
