"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchIcon, SlidersHorizontalIcon, PackageSearchIcon, XIcon } from "lucide-react"

import { productsService, type ProductQuery } from "@/services/products.service"
import { useDebounce } from "@/hooks/use-debounce"
import { useMediaQuery } from "@/hooks/use-media-query"
import { priceBounds } from "@/constants/sorting"
import { defaultFilters, type MarketplaceFilters } from "@/features/marketplace/types"
import { FiltersPanel } from "@/features/marketplace/components/filters-panel"
import { SortSelect } from "@/features/marketplace/components/sort-select"
import { ProductCard } from "@/features/marketplace/components/product-card"
import { ProductGridSkeleton } from "@/components/shared/loading-skeleton"
import { Pagination } from "@/components/ui/pagination"
import { EmptyState } from "@/components/ui/empty-state"
import { ButtonLink } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerBody,
} from "@/components/ui/drawer"
import { Stagger, StaggerItem } from "@/components/shared/reveal"

function toFilters(params: URLSearchParams): MarketplaceFilters {
  const numberParam = (key: string, fallback: number) => {
    const value = params.get(key)
    return value ? Number(value) : fallback
  }
  return {
    category: params.get("category") ?? "all",
    search: params.get("search") ?? "",
    sort: params.get("sort") ?? "popular",
    minPrice: numberParam("minPrice", priceBounds.min),
    maxPrice: numberParam("maxPrice", priceBounds.max),
    rating: numberParam("rating", 0),
    inStock: params.get("inStock") === "1",
    badge: (params.get("badge") as MarketplaceFilters["badge"]) ?? "",
    page: numberParam("page", 1),
  }
}

function toQuery(filters: MarketplaceFilters): ProductQuery {
  return {
    category: filters.category === "all" ? undefined : filters.category,
    search: filters.search || undefined,
    sort: filters.sort as ProductQuery["sort"],
    minPrice: filters.minPrice > priceBounds.min ? filters.minPrice : undefined,
    maxPrice: filters.maxPrice < priceBounds.max ? filters.maxPrice : undefined,
    rating: filters.rating > 0 ? filters.rating : undefined,
    inStock: filters.inStock || undefined,
    badge: filters.badge || undefined,
    page: filters.page,
    pageSize: 12,
  }
}

function MarketplaceView() {
  const router = useRouter()
  const params = useSearchParams()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false)

  const filters = React.useMemo(() => toFilters(new URLSearchParams(params.toString())), [params])
  const debouncedSearch = useDebounce(filters.search, 350)

  const query = React.useMemo(
    () => toQuery({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  )

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["products", query],
    queryFn: () => productsService.getProducts(query),
    placeholderData: (previous) => previous,
  })

  const updateFilters = (patch: Partial<MarketplaceFilters>) => {
    const next = { ...filters, ...patch }
    const url = new URLSearchParams()
    if (next.category !== "all") url.set("category", next.category)
    if (next.search) url.set("search", next.search)
    if (next.sort !== "popular") url.set("sort", next.sort)
    if (next.minPrice > priceBounds.min) url.set("minPrice", String(next.minPrice))
    if (next.maxPrice < priceBounds.max) url.set("maxPrice", String(next.maxPrice))
    if (next.rating > 0) url.set("rating", String(next.rating))
    if (next.inStock) url.set("inStock", "1")
    if (next.badge) url.set("badge", next.badge)
    if (next.page > 1) url.set("page", String(next.page))
    const qs = url.toString()
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false })
  }

  const activeFilterCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.search ? 1 : 0) +
    (filters.minPrice > priceBounds.min || filters.maxPrice < priceBounds.max ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.badge ? 1 : 0)

  const renderFilters = (
    <FiltersPanel
      filters={filters}
      onChange={(patch) => updateFilters(patch)}
      resultCount={data?.total}
    />
  )

  return (
    <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
            Marketplace
          </h1>
          <p className="text-sm text-muted-foreground">
            {data ? `${data.total} healthy listings, updated daily` : "Loading listings…"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
              “{filters.search}”
              <button
                type="button"
                onClick={() => updateFilters({ search: "", page: 1 })}
                aria-label="Clear search"
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-3" />
              </button>
            </span>
          )}
          {isDesktop ? (
            <SortSelect
              value={filters.sort}
              onValueChange={(value) => updateFilters({ sort: value, page: 1 })}
            />
          ) : (
            <ButtonLink
              href="/shop"
              variant="outline"
              size="sm"
              onClick={(event) => {
                event.preventDefault()
                setMobileFiltersOpen(true)
              }}
            >
              <SlidersHorizontalIcon className="size-3.5" />
              Sort & filter
              {activeFilterCount > 0 && (
                <span className="flex size-4 items-center justify-center rounded-full bg-brand text-[0.6rem] text-brand-foreground">
                  {activeFilterCount}
                </span>
              )}
            </ButtonLink>
          )}
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto rounded-2xl border border-border bg-card p-5 pr-4">
            {renderFilters}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="relative mb-5">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={filters.search}
              onChange={(event) => {
                updateFilters({ search: event.target.value, page: 1 })
              }}
              placeholder="Search cattle, poultry, feed…"
              aria-label="Search products"
              className="h-11 w-full rounded-full border border-border bg-card pr-4 pl-10 text-sm transition-all outline-none placeholder:text-muted-foreground focus:border-brand/40 focus:ring-3 focus:ring-brand/10"
            />
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : isError ? (
            <EmptyState
              icon={PackageSearchIcon}
              title="Couldn't load listings"
              description="Something went wrong while fetching products. Please try again."
              action={
                <ButtonLink href="/shop" onClick={() => router.refresh()}>
                  Retry
                </ButtonLink>
              }
            />
          ) : data && data.items.length > 0 ? (
            <>
              <Stagger
                key={JSON.stringify(query)}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {data.items.map((product) => (
                  <StaggerItem key={product.id}>
                    <ProductCard product={product} />
                  </StaggerItem>
                ))}
              </Stagger>
              <div className="mt-10 flex justify-center">
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onPageChange={(page) => {
                    updateFilters({ page })
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                />
              </div>
            </>
          ) : (
            <EmptyState
              icon={PackageSearchIcon}
              title="No listings found"
              description="Try adjusting your filters or search for something else."
              action={
                <ButtonLink
                  href="/shop"
                  onClick={() => updateFilters(defaultFilters)}
                >
                  Clear all filters
                </ButtonLink>
              }
            />
          )}
        </div>
      </div>

      <Drawer open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DrawerContent side="bottom" className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Sort & filter</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          <DrawerBody>
            <div className="mb-5">
              <SortSelect
                value={filters.sort}
                onValueChange={(value) => updateFilters({ sort: value, page: 1 })}
              />
            </div>
            {renderFilters}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export { MarketplaceView }
