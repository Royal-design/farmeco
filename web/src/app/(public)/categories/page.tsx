import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { CategoriesGrid } from "@/features/marketplace/components/categories-grid"

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse the livestock and farm marketplace by category — cattle, goats & sheep, pigs, poultry, horses, rabbits, feed & supplies, eggs & dairy.",
  alternates: { canonical: "/categories" },
}

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Categories"
        title="Shop by species & essentials"
        description="Eight carefully curated categories — each with health-checked listings and verified sellers."
        crumbs={[{ label: "Categories" }]}
      />
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <CategoriesGrid />
      </div>
    </>
  )
}
