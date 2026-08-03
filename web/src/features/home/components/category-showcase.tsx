"use client"

import { useQuery } from "@tanstack/react-query"

import { categoriesService } from "@/services/categories.service"
import { SectionHeading } from "@/components/shared/section-heading"
import { AnimatedButton } from "@/components/shared/animated-button"
import { CategoryCard } from "@/features/marketplace/components/category-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Stagger, StaggerItem } from "@/components/shared/reveal"

function CategoryShowcase() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories", "featured"],
    queryFn: categoriesService.getFeaturedCategories,
  })

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Categories"
          title="Browse by what you farm"
          description="From registered breeding stock to everyday feed, find it all under one roof."
        />
        <AnimatedButton href="/categories" variant="ghost" showArrow>
          All categories
        </AnimatedButton>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      ) : (
        <Stagger className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {data?.map((category) => (
            <StaggerItem key={category.id}>
              <CategoryCard category={category} compact />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </section>
  )
}

export { CategoryShowcase }
