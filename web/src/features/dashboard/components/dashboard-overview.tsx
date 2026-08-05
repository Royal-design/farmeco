"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { PackageIcon, ArrowRightIcon, ShoppingBagIcon, TruckIcon, ClockIcon, WalletIcon } from "lucide-react"

import { ordersService } from "@/services/orders.service"
import { useAuthStore } from "@/store/auth-store"
import { formatDate, formatPrice } from "@/utils/format"
import { StatsCard } from "@/features/dashboard/components/stats-card"
import { OrderCard } from "@/features/dashboard/components/order-card"
import { EmptyState } from "@/components/ui/empty-state"
import { ButtonLink } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function DashboardOverview() {
  const user = useAuthStore((state) => state.user)

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", "recent"],
    queryFn: () => ordersService.getOrders({ page: 1, pageSize: 4 }),
  })

  const items = orders?.items ?? []
  const totalSpent = items.reduce((acc, order) => acc + order.total, 0)
  const activeOrders = items.filter((o) => o.status === "processing" || o.status === "shipped" || o.status === "confirmed").length
  const delivered = items.filter((o) => o.status === "delivered").length

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-medium tracking-tight">
          Welcome back, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your farm orders.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={ShoppingBagIcon} label="Total orders" value={items.length} accent="brand" hint="All time" />
        <StatsCard icon={WalletIcon} label="Total spent" value={totalSpent} prefix="₦" decimals={0} accent="honey" hint="Across all orders" />
        <StatsCard icon={TruckIcon} label="In transit" value={activeOrders} accent="moss" hint="Processing & shipped" />
        <StatsCard icon={ClockIcon} label="Delivered" value={delivered} accent="clay" hint="Completed orders" />
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-medium">Recent orders</h2>
          <ButtonLink href="/account/orders" variant="ghost" size="sm">
            View all
            <ArrowRightIcon className="size-3.5" />
          </ButtonLink>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }, (_, index) => (
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
            icon={PackageIcon}
            title="No orders yet"
            description="When you place an order, it will show up here."
            action={
              <ButtonLink href="/shop">
                Start shopping
                <ArrowRightIcon className="size-4" />
              </ButtonLink>
            }
          />
        )}
      </section>

      <section className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/8 to-moss/8 p-6">
        <h2 className="font-heading text-lg font-medium">Become a seller</h2>
        <p className="mt-1 max-w-lg text-sm text-muted-foreground">
          List your healthy animals and farm essentials to reach 24,000+ buyers.
          Fair 4% fees, built-in health records and delivery coordination.
        </p>
        <ButtonLink href="/contact" className="mt-4">
          Talk to us about selling
        </ButtonLink>
      </section>
    </div>
  )
}

export { DashboardOverview }
