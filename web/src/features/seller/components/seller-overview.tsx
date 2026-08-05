"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowRightIcon,
  PackageIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react"

import { useAuthStore } from "@/store/auth-store"
import { productsService } from "@/services/products.service"
import { ordersService } from "@/services/orders.service"
import { formatPrice } from "@/utils/format"
import { PageHeader } from "@/features/admin/components/page-header"
import { StatsCard } from "@/features/dashboard/components/stats-card"
import { OrderStatusBadge } from "@/features/dashboard/components/order-status-badge"
import { ButtonLink } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

function SellerOverview() {
  const user = useAuthStore((state) => state.user)
  const sellerId = user?.id

  const { data: products } = useQuery({
    queryKey: ["products", "manage", "seller", sellerId, 1, ""],
    queryFn: () => productsService.getProducts({ sellerId, page: 1, pageSize: 100 }),
    enabled: Boolean(sellerId),
  })

  const { data: orders } = useQuery({
    queryKey: ["orders", "seller", "all"],
    queryFn: () => ordersService.getSellerOrders({ page: 1, pageSize: 100 }),
    enabled: Boolean(sellerId),
  })

  const items = products?.items ?? []
  const orderItems = orders?.items ?? []
  const revenue = orderItems.reduce((sum, order) => sum + order.total, 0)
  const pending = orderItems.filter((order) => order.status === "pending").length
  const totalSold = items.reduce((sum, product) => sum + product.sold, 0)
  const lowStock = items
    .filter((product) => product.stock <= 5)
    .sort((a, b) => a.stock - b.stock)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0] ?? "Seller"}`}
        description="Your farm, your listings, your sales."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={PackageIcon} label="Active listings" value={products?.total ?? 0} accent="brand" hint="On the marketplace" />
        <StatsCard icon={ShoppingCartIcon} label="Orders" value={orders?.total ?? 0} accent="honey" hint={`${pending} pending`} />
        <StatsCard icon={WalletIcon} label="Revenue" value={revenue} prefix="₦" decimals={0} accent="moss" hint="Across your orders" />
        <StatsCard icon={TrendingUpIcon} label="Units sold" value={totalSold} accent="clay" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-medium">Recent orders</h2>
            <ButtonLink href="/seller/orders" variant="ghost" size="sm">
              View all
              <ArrowRightIcon className="size-3.5" />
            </ButtonLink>
          </div>
          {!orders ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-12 rounded-xl" />
              ))}
            </div>
          ) : orderItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No orders for your products yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {orderItems.slice(0, 5).map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {order.number}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {order.items.slice(0, 2).map((item) => item.name).join(", ")}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-medium tabular-nums">
                        {formatPrice(order.total)}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-medium">Low stock</h2>
            <ButtonLink href="/seller/products" variant="ghost" size="sm">
              Manage
              <ArrowRightIcon className="size-3.5" />
            </ButtonLink>
          </div>
          {!products ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-12 rounded-xl" />
              ))}
            </div>
          ) : lowStock.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              All your listings are well stocked.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {lowStock.slice(0, 5).map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/seller/products/${product.id}/edit`}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <span className="size-9 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {product.images[0] ? (
                        <img src={product.images[0]} alt="" className="size-full object-cover" />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {product.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {product.sold} sold
                      </span>
                    </span>
                    <Badge variant={product.stock === 0 ? "danger" : "warning"}>
                      {product.stock === 0 ? "Out" : `${product.stock} left`}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export { SellerOverview }
