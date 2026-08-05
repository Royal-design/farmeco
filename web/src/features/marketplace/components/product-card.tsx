"use client"

import * as React from "react"
import Link from "next/link"
import { HeartIcon, ShoppingBagIcon, MapPinIcon } from "lucide-react"
import { toast } from "sonner"

import type { Product } from "@/types/catalog"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/utils/format"
import { useWishlistStore } from "@/store/wishlist-store"
import { useCartStore } from "@/store/cart-store"
import { Badge } from "@/components/ui/badge"
import { Rating } from "@/components/ui/rating"
import { badgeMeta } from "@/constants/order"

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
  showCategory?: boolean
}

function ProductCard({
  product,
  className,
  priority = false,
  showCategory = true,
}: ProductCardProps) {
  const wishlistIds = useWishlistStore((state) => state.ids)
  const toggleWishlist = useWishlistStore((state) => state.toggle)
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)

  const isWishlisted = wishlistIds.includes(product.id)
  const hasDiscount =
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (product.stock <= 0) {
      toast.error("This item is currently out of stock")
      return
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      unit: product.unit,
      quantity: 1,
      stock: product.stock,
    })
    toast.success("Added to cart")
    openCart()
  }

  const handleWishlist = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleWishlist(product.id)
    toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist")
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-lift",
        className
      )}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-[5/4] overflow-hidden bg-muted"
        aria-label={product.name}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.badges.slice(0, 2).map((badge) => {
            const meta = badgeMeta[badge]
            return (
              <Badge
                key={badge}
                className="bg-background/85 text-foreground ring-foreground/15 backdrop-blur-md"
              >
                {meta.label}
              </Badge>
            )
          })}
          {hasDiscount && (
            <Badge className="bg-clay text-white ring-white/20 backdrop-blur-md">
              -
              {Math.round(
                ((1 - product.price / (product.compareAtPrice ?? product.price)) *
                  100)
              )}
              %
            </Badge>
          )}
        </div>

        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-background focus-visible:ring-2 focus-visible:ring-ring/50 data-[pressed=true]:bg-clay/15"
          data-pressed={isWishlisted}
        >
          <HeartIcon
            className={cn(
              "size-4 transition-colors",
              isWishlisted && "fill-clay text-clay"
            )}
          />
        </button>

        {product.stock <= 0 && (
          <span className="absolute inset-x-0 bottom-0 bg-background/85 py-1.5 text-center text-xs font-medium text-muted-foreground backdrop-blur-md">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/shop/${product.slug}`}
            className="font-heading line-clamp-1 text-base font-medium text-foreground transition-colors hover:text-brand"
          >
            {product.name}
          </Link>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPinIcon className="size-3" />
            {product.origin}
          </span>
          <span>{product.unit}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Rating value={product.rating} size="sm" />
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-foreground tabular-nums">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through tabular-nums">
                {formatPrice(product.compareAtPrice ?? product.price)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex size-9 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-sm transition-all duration-300 hover:bg-brand/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBagIcon className="size-4" />
          </button>
        </div>
      </div>
    </article>
  )
}

export { ProductCard }
