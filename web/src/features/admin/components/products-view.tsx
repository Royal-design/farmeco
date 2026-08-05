"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { PencilIcon, PlusIcon, SearchIcon, TrashIcon, PackageSearchIcon } from "lucide-react"
import { toast } from "sonner"

import type { Product } from "@/types/catalog"
import { productsService } from "@/services/products.service"
import { categoriesService } from "@/services/categories.service"
import { getErrorMessage } from "@/lib/errors"
import { formatPrice } from "@/utils/format"
import { useDebounce } from "@/hooks/use-debounce"
import { PageHeader } from "@/features/admin/components/page-header"
import { ProductBadges } from "@/features/admin/components/product-badges"
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/admin/components/table"
import { TableEmpty } from "@/features/admin/components/table-empty"
import { Badge } from "@/components/ui/badge"
import { Button, ButtonLink } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"

const statusVariant: Record<string, "success" | "warning" | "neutral" | "default"> = {
  published: "success",
  draft: "warning",
  archived: "neutral",
}

function ProductsView({
  basePath,
  sellerId,
}: {
  basePath: string
  sellerId?: string
}) {
  const queryClient = useQueryClient()
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null)
  const [deleting, setDeleting] = React.useState(false)
  const debouncedSearch = useDebounce(search, 350)

  const { data: categories } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoriesService.getCategories,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["products", "manage", basePath, sellerId, page, debouncedSearch],
    queryFn: () =>
      productsService.getProducts({
        page,
        pageSize: 12,
        search: debouncedSearch || undefined,
        sellerId,
      }),
  })

  const items = data?.items ?? []
  const categoryName = (id: string) =>
    categories?.find((category) => category.id === id)?.name ?? "—"

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }
    setDeleting(true)
    try {
      await productsService.deleteProduct(deleteTarget.id)
      toast.success("Product deleted")
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ["products", "manage"] })
      queryClient.invalidateQueries({ queryKey: ["categories", "all"] })
    } catch (error) {
      toast.error("Couldn't delete product", {
        description: getErrorMessage(error),
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        description={
          sellerId
            ? "Your listings on the marketplace."
            : "Manage every listing on the marketplace."
        }
        actions={
          <ButtonLink href={`${basePath}/new`}>
            <PlusIcon />
            Add product
          </ButtonLink>
        }
      />

      <div className="relative w-full sm:max-w-xs">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          placeholder="Search products…"
          aria-label="Search products"
          className="pl-9"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <TableEmpty
            icon={PackageSearchIcon}
            title="No products found"
            description="Try a different search or add a new listing."
            actionHref={`${basePath}/new`}
            actionLabel="Add product"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Stock</TableHead>
                <TableHead className="hidden lg:table-cell">Badges</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : null}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/shop/${product.slug}`}
                          className="line-clamp-1 text-sm font-medium hover:text-brand"
                        >
                          {product.name}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {categoryName(product.categoryId)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice ? (
                      <span className="block text-xs text-muted-foreground line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span
                      className={
                        product.stock === 0
                          ? "text-sm font-medium text-destructive"
                          : "text-sm tabular-nums"
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <ProductBadges badges={product.badges} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[product.status] ?? "default"}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <ButtonLink
                        href={`${basePath}/${product.id}/edit`}
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${product.name}`}
                      >
                        <PencilIcon />
                      </ButtonLink>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(product)}
                        aria-label={`Delete ${product.name}`}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this product?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be permanently removed.`
            : undefined
        }
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export { ProductsView }
