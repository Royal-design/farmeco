import type { Metadata } from "next"
import { Suspense } from "react"

import { PageHeader } from "@/components/shared/page-header"
import { MarketplaceView } from "@/features/marketplace/components/marketplace-view"
import { ProductGridSkeleton } from "@/components/shared/loading-skeleton"

export const metadata: Metadata = {
  title: "Marketplace — buy & sell livestock",
  description:
    "Browse health-checked cattle, goats, sheep, pigs, poultry, horses and farm essentials from verified sellers. Filters for price, breed, rating and more.",
  alternates: { canonical: "/shop" },
}

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="Everything your farm needs"
        description="Health-checked livestock and farm essentials from verified local farms — with complete records on every listing."
        crumbs={[{ label: "Marketplace" }]}
      />
      <div className="py-10">
        <Suspense fallback={<ProductGridSkeleton count={8} className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10" />}>
          <MarketplaceView />
        </Suspense>
      </div>
    </>
  )
}
