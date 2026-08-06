"use client"

import { CheckIcon, TruckIcon, XCircleIcon } from "lucide-react"

import type { Order, OrderStatus } from "@/types/order"
import { orderStatusMeta } from "@/constants/order"
import { formatDate } from "@/utils/format"
import { cn } from "@/lib/utils"

const FULFILLMENT_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
]

interface OrderProgressProps {
  order: Order
}

function OrderProgress({ order }: OrderProgressProps) {
  const isCancelled = order.status === "cancelled"
  const events = new Map(
    (order.statusHistory ?? []).map((event) => [event.status, event.at])
  )
  const currentIndex = FULFILLMENT_STEPS.indexOf(order.status)
  const lastReachedIndex = isCancelled ? currentIndex - 1 : currentIndex

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-5 flex items-center gap-2 font-heading text-base font-medium">
        <TruckIcon className="size-4 text-brand" />
        Order progress
      </h2>

      {isCancelled && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm font-medium text-destructive">
          <XCircleIcon className="size-4" />
          This order was cancelled
        </div>
      )}

      <ol className="flex flex-col">
        {FULFILLMENT_STEPS.map((step, index) => {
          const reached = !isCancelled && index <= currentIndex
          const at = events.get(step)
          return (
            <li key={step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border",
                    reached
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {reached ? (
                    <CheckIcon className="size-3.5" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-current" />
                  )}
                </span>
                {index < FULFILLMENT_STEPS.length - 1 && (
                  <span
                    className={cn(
                      "w-px flex-1",
                      index < lastReachedIndex ? "bg-brand" : "bg-border"
                    )}
                  />
                )}
              </div>
              <div className="pb-5 pt-0.5">
                <p
                  className={cn(
                    "text-sm font-medium",
                    reached ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {orderStatusMeta[step].label}
                </p>
                {at && reached && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(at, "en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export { OrderProgress }
