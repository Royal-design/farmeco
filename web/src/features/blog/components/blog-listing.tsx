"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { NewspaperIcon } from "lucide-react"

import { blogService } from "@/services/blog.service"
import { cn } from "@/lib/utils"
import { BlogCard } from "@/features/blog/components/blog-card"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Stagger, StaggerItem } from "@/components/shared/reveal"

function BlogListing() {
  const [category, setCategory] = React.useState("all")

  const { data: categories } = useQuery({
    queryKey: ["blog", "categories"],
    queryFn: blogService.getPostCategories,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["blog", "list", category],
    queryFn: () => blogService.getPosts({ category, pageSize: 50 }),
  })

  const posts = data?.items ?? []

  return (
    <div className="flex flex-col gap-8">
      <div role="tablist" aria-label="Blog categories" className="flex flex-wrap gap-1.5">
        <button
          type="button"
          role="tab"
          aria-selected={category === "all"}
          onClick={() => setCategory("all")}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            category === "all"
              ? "border-brand bg-brand text-brand-foreground"
              : "border-border text-muted-foreground hover:border-brand/30 hover:text-foreground"
          )}
        >
          All
        </button>
        {categories?.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={category === item}
            onClick={() => setCategory(item)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              category === item
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border text-muted-foreground hover:border-brand/30 hover:text-foreground"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <BlogCard post={post} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <EmptyState
          icon={NewspaperIcon}
          title="No articles yet"
          description="Check back soon for new guides in this category."
        />
      )}
    </div>
  )
}

export { BlogListing }
