"use client"

import { useQuery } from "@tanstack/react-query"

import { productsService } from "@/services/products.service"
import { SectionHeading } from "@/components/shared/section-heading"
import { AnimatedButton } from "@/components/shared/animated-button"
import { ProductCard } from "@/features/marketplace/components/product-card"
import { ProductGridSkeleton } from "@/components/shared/loading-skeleton"
import { Stagger, StaggerItem } from "@/components/shared/reveal"

function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () =>
      productsService.getProducts({
        page: 1,
        pageSize: 8,
        sort: "popular",
      }),
  })

  return (
    <section className="border-y border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Fresh this week"
            title="Featured livestock & essentials"
            description="A hand-picked selection of the most-loved listings on the marketplace right now."
          />
          <AnimatedButton href="/shop" variant="ghost" showArrow>
            View everything
          </AnimatedButton>
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
    </section>
  )
}

export { FeaturedProducts }
