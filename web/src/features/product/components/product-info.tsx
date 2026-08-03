"use client"

import * as React from "react"
import {
  HeartIcon,
  ShoppingBagIcon,
  ZapIcon,
  MapPinIcon,
  Building2Icon,
  TruckIcon,
  ShieldCheckIcon,
  RefreshCcwIcon,
  BadgeCheckIcon,
} from "lucide-react"
import { toast } from "sonner"

import type { Product } from "@/types/catalog"
import { formatPrice, formatNumber } from "@/utils/format"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Rating } from "@/components/ui/rating"
import { badgeMeta } from "@/constants/order"
import { QuantityStepper } from "@/features/cart/components/quantity-stepper"

interface ProductInfoProps {
  product: Product
}

const deliveryHighlights = [
  { icon: TruckIcon, label: "Delivery in 3–5 days" },
  { icon: ShieldCheckIcon, label: "7-day health guarantee" },
  { icon: RefreshCcwIcon, label: "Easy returns & swaps" },
]

function ProductInfo({ product }: ProductInfoProps) {
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)
  const wishlistIds = useWishlistStore((state) => state.ids)
  const toggleWishlist = useWishlistStore((state) => state.toggle)
  const [quantity, setQuantity] = React.useState(1)

  const isWishlisted = wishlistIds.includes(product.id)
  const inStock = product.stock > 0
  const hasDiscount =
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price

  const handleAddToCart = () => {
    if (!inStock) return
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      unit: product.unit,
      quantity,
      stock: product.stock,
    })
    toast.success(`Added ${product.name} to cart`)
    openCart()
  }

  const handleBuyNow = () => {
    if (!inStock) return
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      unit: product.unit,
      quantity,
      stock: product.stock,
    })
    toast.success("Heading to checkout")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {product.badges.map((badge) => (
          <Badge key={badge} variant={badgeMeta[badge].tone as never}>
            {badgeMeta[badge].label}
          </Badge>
        ))}
      </div>

      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Rating value={product.rating} showValue size="md" count={product.reviewCount} />
        <span className="text-sm text-muted-foreground">
          · {formatNumber(product.sold)} sold
        </span>
      </div>

      <div className="flex items-end gap-3 rounded-2xl border border-border bg-muted/40 p-5">
        <div className="flex flex-col">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through tabular-nums">
              {formatPrice(product.compareAtPrice ?? product.price)}
            </span>
          )}
        </div>
        <span className="text-sm text-muted-foreground">per {product.unit}</span>
        {inStock ? (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {product.stock} in stock
          </span>
        ) : (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} max={product.stock} />
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock}
            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-medium text-brand-foreground transition-all hover:bg-brand/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBagIcon className="size-4" />
            Add to cart
          </button>
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-pressed={isWishlisted}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-all",
              isWishlisted
                ? "border-clay/30 bg-clay/10 text-clay"
                : "border-border text-muted-foreground hover:border-clay/40 hover:text-clay"
            )}
          >
            <HeartIcon className={cn("size-4", isWishlisted && "fill-current")} />
          </button>
        </div>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!inStock}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-5 text-sm font-medium text-brand transition-colors hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ZapIcon className="size-4" />
          Buy it now
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetaRow icon={MapPinIcon} label="Origin" value={product.origin} />
        <MetaRow icon={Building2Icon} label="Farm" value={product.farm} />
      </div>

      <div className="flex flex-col gap-2.5 rounded-2xl border border-border p-4">
        {deliveryHighlights.map((item) => (
          <div key={item.label} className="flex items-center gap-3 text-sm">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand/8 text-brand">
              <item.icon className="size-4" />
            </span>
            {item.label}
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-brand/5 p-3 text-xs leading-relaxed text-brand/90">
        <BadgeCheckIcon className="mt-0.5 size-4 shrink-0" />
        <span>
          This listing includes full health records. Ask the seller for vaccination
          logs and vet reports before delivery.
        </span>
      </div>
    </div>
  )
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5">
      <Icon className="size-4 shrink-0 text-brand" />
      <div className="min-w-0">
        <p className="text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

export { ProductInfo }
