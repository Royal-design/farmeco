"use client"

import * as React from "react"
import { motion } from "framer-motion"

import type { Product } from "@/types/catalog"
import { cn } from "@/lib/utils"
import { ReviewList } from "@/features/product/components/review-list"
import { ReviewForm } from "@/features/product/components/review-form"

interface ProductTabsProps {
  product: Product
}

const tabs = [
  { id: "description", label: "Description" },
  { id: "specifications", label: "Specifications" },
  { id: "reviews", label: "Reviews" },
] as const

type TabId = (typeof tabs)[number]["id"]

function ProductTabs({ product }: ProductTabsProps) {
  const [active, setActive] = React.useState<TabId>("description")

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Product details"
        className="inline-flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-card p-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              active === tab.id ? "text-brand-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active === tab.id && (
              <motion.span
                layoutId={`tab-pill-${product.id}`}
                className="absolute inset-0 rounded-full bg-brand"
                transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">
              {tab.label}
              {tab.id === "reviews" && product.reviewCount > 0 && (
                <span className="ml-1.5">({product.reviewCount})</span>
              )}
            </span>
          </button>
        ))}
      </div>

      <div role="tabpanel" className="min-h-48">
        {active === "description" && (
          <div className="max-w-3xl space-y-4">
            <p className="text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {active === "specifications" && (
          <dl className="grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between gap-4 bg-card px-5 py-4"
              >
                <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                <dd className="text-sm font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {active === "reviews" && (
          <div className="grid max-w-4xl gap-8 lg:grid-cols-[1fr_0.9fr]">
            <ReviewList reviews={product.reviews} />
            <div className="lg:sticky lg:top-32 lg:self-start">
              <h3 className="mb-4 font-heading text-lg font-medium">
                Write a review
              </h3>
              <div className="rounded-2xl border border-border bg-card p-5">
                <ReviewForm productId={product.id} productName={product.name} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { ProductTabs }
