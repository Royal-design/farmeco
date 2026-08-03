"use client"

import { useQuery } from "@tanstack/react-query"
import { HeartIcon, ArrowRightIcon } from "lucide-react"

import { useWishlistStore } from "@/store/wishlist-store"
import { productsService } from "@/services/products.service"
import { EmptyState } from "@/components/ui/empty-state"
import { ButtonLink } from "@/components/ui/button"
import { ProductCard } from "@/features/marketplace/components/product-card"
import { ProductGridSkeleton } from "@/components/shared/loading-skeleton"
import { Stagger, StaggerItem } from "@/components/shared/reveal"

function WishlistView() {
  const ids = useWishlistStore((state) => state.ids)

  const { data, isLoading } = useQuery({
    queryKey: ["products", "wishlist", ids],
    queryFn: () => productsService.getProducts({ ids, pageSize: 48 }),
    enabled: ids.length > 0,
  })

  if (ids.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 sm:px-8">
        <EmptyState
          icon={HeartIcon}
          title="Your wishlist is empty"
          description="Tap the heart on any listing to save it here for later."
          action={
            <ButtonLink href="/shop">
              Explore marketplace
              <ArrowRightIcon className="size-4" />
            </ButtonLink>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-medium tracking-tight">Your wishlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ids.length} saved {ids.length === 1 ? "listing" : "listings"}
        </p>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.items.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  )
}

export { WishlistView }
