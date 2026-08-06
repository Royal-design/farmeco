"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { HeartIcon, ShoppingBagIcon, MapPinIcon } from "lucide-react"
import { toast } from "sonner"

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
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

  const handleWhatsApp = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!WHATSAPP_NUMBER) return
    const productLink = `${window.location.origin}/shop/${product.slug}`
    const message = `Hello! I'm interested in "${product.name}" (${formatPrice(
      product.price
    )} per ${product.unit}). Is it available?\n${productLink}`
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    )
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
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading={priority ? "eager" : "lazy"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : null}

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
          <div className="flex items-center gap-2">
            {WHATSAPP_NUMBER && (
              <button
                type="button"
                onClick={handleWhatsApp}
                aria-label={`Order ${product.name} on WhatsApp`}
                title="Order on WhatsApp"
                className="inline-flex size-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition-all duration-300 hover:bg-[#1fb457] hover:shadow-md"
              >
                <WhatsAppIcon className="size-4" />
              </button>
            )}
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
      </div>
    </article>
  )
}

export { ProductCard }
