import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { BlogListing } from "@/features/blog/components/blog-listing"

export const metadata: Metadata = {
  title: "Blog & guides",
  description:
    "Practical advice from vets, breeders and specialists — buying guides, poultry care, dairy genetics, pasture management and more.",
  alternates: { canonical: "/blog" },
}

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="From the field"
        title="Guides & stories worth reading"
        description="Practical advice from vets, breeders and specialists who live the work every day."
        crumbs={[{ label: "Blog" }]}
      />
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <BlogListing />
      </div>
    </>
  )
}
