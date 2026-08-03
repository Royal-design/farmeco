"use client"

import { useQuery } from "@tanstack/react-query"

import { categoriesService } from "@/services/categories.service"
import { CategoryCard } from "@/features/marketplace/components/category-card"
import { Stagger, StaggerItem } from "@/components/shared/reveal"
import { Skeleton } from "@/components/ui/skeleton"

function CategoriesGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoriesService.getCategories,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="aspect-[4/5] rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <Stagger className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {data?.map((category) => (
        <StaggerItem key={category.id}>
          <CategoryCard category={category} />
        </StaggerItem>
      ))}
    </Stagger>
  )
}

export { CategoriesGrid }
