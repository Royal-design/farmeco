"use client"

import { useQuery } from "@tanstack/react-query"
import { SlidersHorizontalIcon, StarIcon, XIcon } from "lucide-react"

import { ButtonLink } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { priceBounds } from "@/constants/sorting"
import {
  badgeOptions,
  type MarketplaceFilters,
  ratingOptions,
} from "@/features/marketplace/types"
import { cn } from "@/lib/utils"
import { categoriesService } from "@/services/categories.service"
import { formatNumber } from "@/utils/format"
import Image from "next/image"

interface FiltersProps {
  filters: MarketplaceFilters
  onChange: (patch: Partial<MarketplaceFilters>) => void
  resultCount?: number
}

function CategoryList({
  filters,
  onChange,
}: {
  filters: MarketplaceFilters
  onChange: FiltersProps["onChange"]
}) {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoriesService.getCategories,
  })

  const all = { id: "all", name: "All categories", slug: "all", productCount: undefined as number | undefined }

  return (
    <div className="flex flex-col gap-1">
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-8 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => onChange({ category: "all" })}
            className={cn(
              "flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors",
              filters.category === "all"
                ? "bg-brand/10 font-medium text-brand"
                : "text-foreground hover:bg-muted"
            )}
          >
            <span className="flex items-center gap-2">All categories</span>
            {!filters.category || filters.category === "all" ? (
              <span className="text-xs text-muted-foreground">
                {categories?.reduce((acc, c) => acc + c.productCount, 0)}
              </span>
            ) : null}
          </button>
          {categories?.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange({ category: category.slug, page: 1 })}
              className={cn(
                "flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors",
                filters.category === category.slug
                  ? "bg-brand/10 font-medium text-brand"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-2">
  {category.image ? (
    <Image
      src={category.image}
      alt=""
      width={16}
      height={16}
      className="h-4 w-4 rounded-full object-cover"
    />
  ) : category.emoji ? (
    <span aria-hidden="true">{category.emoji}</span>
  ) : null}

  <span>{category.name}</span>
</div>
              <span className="text-xs text-muted-foreground">
                {formatNumber(category.productCount)}
              </span>
            </button>
          ))}
        </>
      )}
    </div>
  )
}

function FiltersPanel({ filters, onChange, resultCount }: FiltersProps) {
  const isDirty =
    filters.category !== "all" ||
    filters.minPrice > priceBounds.min ||
    filters.maxPrice < priceBounds.max ||
    filters.rating > 0 ||
    filters.inStock ||
    filters.badge !== ""

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-base font-medium">
          <SlidersHorizontalIcon className="size-4 text-brand" />
          Filters
          {typeof resultCount === "number" && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
              {resultCount}
            </span>
          )}
        </h2>
        {isDirty && (
          <button
            type="button"
            onClick={() =>
              onChange({
                category: "all",
                minPrice: priceBounds.min,
                maxPrice: priceBounds.max,
                rating: 0,
                inStock: false,
                badge: "",
                page: 1,
              })
            }
            className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
          >
            <XIcon className="size-3" />
            Clear all
          </button>
        )}
      </div>

      <div>
        <h3 className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Category
        </h3>
        <CategoryList filters={filters} onChange={onChange} />
      </div>

      <Separator />

      <div>
        <h3 className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Price range
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground">
              ₦
            </span>
            <Input
              type="number"
              min={priceBounds.min}
              max={priceBounds.max}
              value={filters.minPrice || ""}
              onChange={(event) =>
                onChange({ minPrice: Number(event.target.value) || 0, page: 1 })
              }
              placeholder="Min"
              aria-label="Minimum price"
              className="pl-6"
            />
          </div>
          <span className="text-muted-foreground">–</span>
          <div className="relative flex-1">
            <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground">
              ₦
            </span>
            <Input
              type="number"
              min={priceBounds.min}
              max={priceBounds.max}
              value={filters.maxPrice >= priceBounds.max ? "" : filters.maxPrice}
              onChange={(event) =>
                onChange({ maxPrice: Number(event.target.value) || priceBounds.max, page: 1 })
              }
              placeholder="Max"
              aria-label="Maximum price"
              className="pl-6"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Rating
        </h3>
        <div className="flex flex-col gap-1">
          {ratingOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange({
                  rating: filters.rating === option.value ? 0 : option.value,
                  page: 1,
                })
              }
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                filters.rating === option.value
                  ? "bg-brand/10 font-medium text-brand"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <span className="flex items-center gap-1 text-honey">
                {Array.from({ length: 5 }, (_, index) => (
                  <StarIcon
                    key={index}
                    className={cn(
                      "size-3.5",
                      index < option.value ? "fill-current" : "opacity-25"
                    )}
                  />
                ))}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {badgeOptions.map((badge) => {
            const active = filters.badge === badge.value
            return (
              <button
                key={badge.value}
                type="button"
                onClick={() =>
                  onChange({
                    badge: active ? "" : badge.value,
                    page: 1,
                  })
                }
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border text-muted-foreground hover:border-brand/30 hover:text-foreground"
                )}
              >
                {badge.label}
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">In stock only</p>
          <p className="text-xs text-muted-foreground">Hide sold-out listings</p>
        </div>
        <Switch
          checked={filters.inStock}
          onCheckedChange={(checked) => onChange({ inStock: checked, page: 1 })}
          aria-label="In stock only"
        />
      </div>

      <ButtonLink href="/shop" variant="outline" size="sm" className="w-full">
        Reset all
      </ButtonLink>
    </div>
  )
}

export { FiltersPanel }
