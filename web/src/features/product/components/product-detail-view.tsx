"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

import type { Product } from "@/types/catalog"
import { productsService } from "@/services/products.service"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ProductGallery } from "@/features/product/components/product-gallery"
import { ProductInfo } from "@/features/product/components/product-info"
import { ProductTabs } from "@/features/product/components/product-tabs"
import { ProductCard } from "@/features/marketplace/components/product-card"
import { SectionHeading } from "@/components/shared/section-heading"
import { Stagger, StaggerItem } from "@/components/shared/reveal"
import { ProductGridSkeleton } from "@/components/shared/loading-skeleton"

interface ProductDetailViewProps {
  slug: string
  initialProduct: Product
}

function ProductDetailView({ slug, initialProduct }: ProductDetailViewProps) {
  const { data: product } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => (await productsService.getProduct(slug)) as Product,
    initialData: initialProduct,
  })

  const { data: related, isLoading: relatedLoading } = useQuery({
    queryKey: ["products", "related", product.id],
    queryFn: () => productsService.getRelatedProducts(product),
    enabled: !!product,
  })

  return (
    <div className="mx-auto max-w-7xl px-5 pt-6 pb-20 sm:px-8 lg:px-10">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Marketplace", href: "/shop" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />
        <div className="lg:pt-2">
          <ProductInfo product={product} />
        </div>
      </div>

      <div className="mt-16">
        <ProductTabs product={product} />
      </div>

      <section className="mt-20">
        <SectionHeading
          eyebrow="You may also like"
          title="Similar listings"
          description="Other farmers are looking at these too."
          className="mb-8"
        />
        {relatedLoading ? (
          <ProductGridSkeleton count={4} className="sm:grid-cols-2 lg:grid-cols-4" />
        ) : (
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related?.map((item) => (
              <StaggerItem key={item.id}>
                <ProductCard product={item} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="text-sm font-medium text-brand hover:underline"
          >
            Continue browsing the marketplace →
          </Link>
        </div>
      </section>
    </div>
  )
}

export { ProductDetailView }
