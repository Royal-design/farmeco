"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRightIcon,
  ShoppingBagIcon,
  TagIcon,
  Trash2Icon,
  ShieldCheckIcon,
  TruckIcon,
  RotateCcwIcon,
} from "lucide-react"
import { toast } from "sonner"

import { useCartStore, selectCartSubtotal, selectCartCount } from "@/store/cart-store"
import { couponsService } from "@/services/coupons.service"
import type { Coupon } from "@/types/order"
import { formatPrice } from "@/utils/format"
import { useShippingSettings } from "@/hooks/use-shipping-settings"
import { EmptyState } from "@/components/ui/empty-state"
import { Button, ButtonLink } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QuantityStepper } from "@/features/cart/components/quantity-stepper"
import { Input } from "@/components/ui/input"

function CartPage() {
  const items = useCartStore((state) => state.items)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const subtotal = useCartStore(selectCartSubtotal)
  const count = useCartStore(selectCartCount)
  const shipping = useShippingSettings()

  const [couponCode, setCouponCode] = React.useState("")
  const [appliedCoupon, setAppliedCoupon] = React.useState<Coupon | null>(null)
  const [applying, setApplying] = React.useState(false)

  const remaining = Math.max(0, shipping.freeShippingThreshold - subtotal)
  const progress = Math.min(1, subtotal / shipping.freeShippingThreshold)

  const discount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? subtotal * (appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0

  const total = Math.max(0, subtotal - discount)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || applying) return
    setApplying(true)
    const result = await couponsService.validateCoupon(couponCode, subtotal)
    setApplying(false)
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon)
      toast.success(`Coupon ${result.coupon.code} applied!`)
    } else {
      toast.error(result.message ?? "Invalid coupon")
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 sm:px-8">
        <EmptyState
          icon={ShoppingBagIcon}
          title="Your cart is empty"
          description="Add healthy livestock and farm essentials to get started."
          action={
            <ButtonLink href="/shop">
              Browse marketplace
              <ArrowRightIcon className="size-4" />
            </ButtonLink>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight">Your cart</h1>
          <p className="text-sm text-muted-foreground">{count} item{count === 1 ? "" : "s"} selected</p>
        </div>
        <Link
          href="/shop"
          className="text-sm font-medium text-brand hover:underline"
        >
          Continue shopping
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-2xl border border-border bg-card p-4 sm:items-center"
            >
              <Link
                href={`/shop/${item.slug}`}
                className="size-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-28"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={112}
                    height={112}
                    className="size-full object-cover"
                  />
                ) : null}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="line-clamp-2 font-medium hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatPrice(item.price)} / {item.unit}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Remove ${item.name}`}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <QuantityStepper
                    value={item.quantity}
                    max={item.stock}
                    onChange={(quantity) => setQuantity(item.productId, quantity)}
                  />
                  <span className="font-semibold tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-36 lg:self-start">
          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-medium">Order summary</h2>

            <div className="space-y-1 rounded-xl bg-muted/60 p-3.5 text-sm">
              <p className="text-muted-foreground">
                {remaining > 0 ? (
                  <>
                    Add <span className="font-semibold text-foreground">{formatPrice(remaining)}</span>{" "}
                    more for <span className="font-semibold text-foreground">free delivery</span>
                  </>
                ) : (
                  <span className="font-medium text-brand">Free delivery unlocked!</span>
                )}
              </p>
              <Progress value={progress * 100} className="h-1.5" />
            </div>

            <div className="space-y-2 border-b pb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium">{remaining > 0 ? "Calculated at checkout" : "Free"}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-medium tabular-nums">−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 text-base">
                <span className="font-medium">Total</span>
                <span className="font-semibold tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <TagIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  aria-label="Coupon code"
                  className="h-9 pl-8"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim() || applying}
              >
                {applying ? "Applying…" : appliedCoupon ? "Applied" : "Apply"}
              </Button>
            </div>

            <ButtonLink href="/checkout" className="w-full">
              Proceed to checkout
              <ArrowRightIcon className="size-4" />
            </ButtonLink>

            <ul className="flex flex-col gap-2 border-t pt-4 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <ShieldCheckIcon className="size-3.5 text-brand" /> Secure payment processed by Farmeco
              </li>
              <li className="flex items-center gap-2">
                <TruckIcon className="size-3.5 text-brand" /> Live-animal delivery with licensed hauliers
              </li>
              <li className="flex items-center gap-2">
                <RotateCcwIcon className="size-3.5 text-brand" /> 7-day health guarantee on every animal
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export { CartPage }
