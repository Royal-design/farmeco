"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import {
  DollarSignIcon,
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
  ArrowRightIcon,
} from "lucide-react"

import { usersService } from "@/services/users.service"
import { productsService } from "@/services/products.service"
import { ordersService } from "@/services/orders.service"
import { formatPrice } from "@/utils/format"
import { PageHeader } from "@/features/admin/components/page-header"
import { StatsCard } from "@/features/dashboard/components/stats-card"
import { OrderStatusBadge } from "@/features/dashboard/components/order-status-badge"
import { ButtonLink } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function AdminOverview() {
  const { data: users } = useQuery({
    queryKey: ["users", "admin", 1],
    queryFn: () => usersService.getUsers({ page: 1, pageSize: 1 }),
  })

  const { data: products } = useQuery({
    queryKey: ["products", "all", 1],
    queryFn: () => productsService.getProducts({ page: 1, pageSize: 1 }),
  })

  const { data: orders } = useQuery({
    queryKey: ["orders", "admin", "all"],
    queryFn: () => ordersService.getAdminOrders({ page: 1, pageSize: 100 }),
  })

  const { data: topProducts } = useQuery({
    queryKey: ["products", "popular", "admin"],
    queryFn: () => productsService.getProducts({ sort: "popular", pageSize: 5 }),
  })

  const revenue =
    orders?.items.reduce((sum, order) => sum + order.total, 0) ?? 0
  const pending =
    orders?.items.filter((order) => order.status === "pending").length ?? 0

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Admin overview"
        description="Platform health at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={UsersIcon} label="Registered users" value={users?.total ?? 0} accent="brand" hint="All roles" />
        <StatsCard icon={PackageIcon} label="Products" value={products?.total ?? 0} accent="moss" hint="Live listings" />
        <StatsCard icon={ShoppingCartIcon} label="Orders" value={orders?.total ?? 0} accent="honey" hint={`${pending} pending`} />
        <StatsCard icon={DollarSignIcon} label="Revenue" value={revenue} prefix="₦" decimals={0} accent="clay" hint="Across recent orders" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-medium">Recent orders</h2>
            <ButtonLink href="/admin/orders" variant="ghost" size="sm">
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
          ) : orders.items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No orders yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {orders.items.slice(0, 5).map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {order.number}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {order.shippingAddress.fullName}
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
            <h2 className="font-heading text-lg font-medium">Top sellers</h2>
            <ButtonLink href="/admin/products" variant="ghost" size="sm">
              View all
              <ArrowRightIcon className="size-3.5" />
            </ButtonLink>
          </div>
          {!topProducts ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-12 rounded-xl" />
              ))}
            </div>
          ) : topProducts.items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No products yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {topProducts.items.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/shop/${product.slug}`}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <span className="size-9 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt=""
                          className="size-full object-cover"
                        />
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
                    <span className="text-sm font-medium tabular-nums">
                      {formatPrice(product.price)}
                    </span>
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

export { AdminOverview }
