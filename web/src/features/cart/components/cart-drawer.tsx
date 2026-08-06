"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2Icon, ArrowRightIcon, ShoppingBagIcon } from "lucide-react"
import { toast } from "sonner"

import { useCartStore, selectCartSubtotal, selectCartCount } from "@/store/cart-store"
import { formatPrice } from "@/utils/format"
import { useShippingSettings } from "@/hooks/use-shipping-settings"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer"
import { ButtonLink } from "@/components/ui/button"
import { QuantityStepper } from "@/features/cart/components/quantity-stepper"
import { EmptyState } from "@/components/ui/empty-state"
import { Progress } from "@/components/ui/progress"

function FreeShippingProgress() {
  const subtotal = useCartStore(selectCartSubtotal)
  const shipping = useShippingSettings()
  const remaining = Math.max(0, shipping.freeShippingThreshold - subtotal)
  const progress = Math.min(1, subtotal / shipping.freeShippingThreshold)

  return (
    <div className="space-y-1.5 rounded-xl bg-muted/70 p-3 text-xs">
      <p className="text-muted-foreground">
        {remaining > 0 ? (
          <>
            Add <span className="font-medium text-foreground">{formatPrice(remaining)}</span>{" "}
            more to unlock <span className="font-medium text-foreground">free delivery</span>
          </>
        ) : (
          <span className="font-medium text-brand">Free delivery unlocked!</span>
        )}
      </p>
      <Progress value={progress * 100} className="h-1.5" />
    </div>
  )
}

function CartDrawer() {
  const items = useCartStore((state) => state.items)
  const isOpen = useCartStore((state) => state.isOpen)
  const closeCart = useCartStore((state) => state.closeCart)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const count = useCartStore(selectCartCount)
  const subtotal = useCartStore(selectCartSubtotal)

  const handleRemove = (productId: string, name: string) => {
    removeItem(productId)
    toast.success(`Removed ${name} from cart`)
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <DrawerContent side="right" className="z-[70]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingBagIcon className="size-4" />
            Your cart
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
              {count}
            </span>
          </DrawerTitle>
          <DrawerClose />
        </DrawerHeader>

        {items.length === 0 ? (
          <DrawerBody>
            <EmptyState
              icon={ShoppingBagIcon}
              title="Your cart is empty"
              description="Browse the marketplace and add healthy livestock and farm essentials."
              action={
                <ButtonLink href="/shop" onClick={closeCart}>
                  Explore marketplace
                  <ArrowRightIcon className="size-4" />
                </ButtonLink>
              }
            />
          </DrawerBody>
        ) : (
          <>
            <DrawerBody className="space-y-3">
              <FreeShippingProgress />
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 rounded-xl border border-border bg-card p-2.5"
                >
                  <Link
                    href={`/shop/${item.slug}`}
                    onClick={closeCart}
                    className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="size-full object-cover"
                      />
                    ) : null}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={closeCart}
                        className="line-clamp-2 text-sm font-medium hover:text-brand"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId, item.name)}
                        aria-label={`Remove ${item.name}`}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2Icon className="size-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatPrice(item.price)} / {item.unit}
                    </span>
                    <div className="mt-auto flex items-center justify-between">
                      <QuantityStepper
                        size="sm"
                        value={item.quantity}
                        max={item.stock}
                        onChange={(quantity) =>
                          setQuantity(item.productId, quantity)
                        }
                      />
                      <span className="text-sm font-semibold tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </DrawerBody>

            <DrawerFooter className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-semibold tabular-nums">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Delivery calculated at checkout.
              </p>
              <div className="flex gap-2">
                <ButtonLink
                  href="/cart"
                  variant="outline"
                  className="flex-1"
                  onClick={closeCart}
                >
                  View cart
                </ButtonLink>
                <ButtonLink href="/checkout" className="flex-1" onClick={closeCart}>
                  Checkout
                  <ArrowRightIcon className="size-4" />
                </ButtonLink>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}

export { CartDrawer }
