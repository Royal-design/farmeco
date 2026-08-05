"use client"

import * as React from "react"
import Link from "next/link"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { PackageSearchIcon } from "lucide-react"
import { toast } from "sonner"

import type { Order, OrderStatus } from "@/types/order"
import { ordersService } from "@/services/orders.service"
import { getErrorMessage } from "@/lib/errors"
import { formatDate, formatPrice } from "@/utils/format"
import { orderStatuses, orderStatusMeta } from "@/constants/order"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/features/admin/components/page-header"
import { OrderStatusBadge } from "@/features/dashboard/components/order-status-badge"
import { StatusSelect } from "@/features/admin/components/status-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/admin/components/table"
import { TableEmpty } from "@/features/admin/components/table-empty"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"

const tabs: Array<{ value: OrderStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  ...orderStatuses.map((status) => ({
    value: status,
    label: orderStatusMeta[status].label,
  })),
]

function OrdersView({ scope }: { scope: "admin" | "seller" }) {
  const queryClient = useQueryClient()
  const [status, setStatus] = React.useState<OrderStatus | "all">("all")
  const [page, setPage] = React.useState(1)

  const queryFn =
    scope === "admin" ? ordersService.getAdminOrders : ordersService.getSellerOrders

  const { data, isLoading } = useQuery({
    queryKey: ["orders", scope, status, page],
    queryFn: () => queryFn({ status, page, pageSize: 15 }),
  })

  const items = data?.items ?? []

  const statusMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: OrderStatus }) =>
      ordersService.updateOrderStatus(id, next),
    onSuccess: () => {
      toast.success("Order status updated")
      queryClient.invalidateQueries({ queryKey: ["orders", scope] })
    },
    onError: (error) => {
      toast.error("Couldn't update order status", {
        description: getErrorMessage(error),
      })
      queryClient.invalidateQueries({ queryKey: ["orders", scope] })
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        description={
          scope === "admin"
            ? "Track and manage every order on the platform."
            : "Orders that include your products."
        }
      />

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
            onClick={() => {
              setStatus(tab.value)
              setPage(1)
            }}
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

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <TableEmpty
            icon={PackageSearchIcon}
            title="No orders found"
            description="Orders will appear here as they come in."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead className="hidden sm:table-cell">Customer</TableHead>
                <TableHead className="hidden md:table-cell">Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onStatusChange={(next) =>
                    statusMutation.mutate({ id: order.id, next })
                  }
                  updating={statusMutation.isPending}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

function OrderRow({
  order,
  onStatusChange,
  updating,
}: {
  order: Order
  onStatusChange: (status: OrderStatus) => void
  updating: boolean
}) {
  return (
    <TableRow>
      <TableCell>
        <Link
          href={`/account/orders/${order.id}`}
          className="text-sm font-medium hover:text-brand"
        >
          {order.number}
        </Link>
        <p className="text-xs text-muted-foreground">
          {order.items.length} item{order.items.length === 1 ? "" : "s"}
        </p>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <span className="text-sm">{order.shippingAddress.fullName}</span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <span className="line-clamp-1 max-w-56 text-sm text-muted-foreground">
          {order.items.map((item) => item.name).join(", ")}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-sm font-medium tabular-nums">
          {formatPrice(order.total)}
        </span>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <span className="text-sm text-muted-foreground">
          {formatDate(order.createdAt)}
        </span>
      </TableCell>
      <TableCell>
        {updating ? (
          <OrderStatusBadge status={order.status} />
        ) : (
          <StatusSelect value={order.status} onValueChange={onStatusChange} />
        )}
      </TableCell>
    </TableRow>
  )
}

export { OrdersView }
