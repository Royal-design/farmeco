"use client"

import { useQuery } from "@tanstack/react-query"

import { productsService } from "@/services/products.service"
import { PageHeader } from "@/features/admin/components/page-header"
import { ProductForm } from "@/features/admin/components/product-form"
import { ButtonLink } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { PackageSearchIcon } from "lucide-react"

function ProductEditView({ productId }: { productId: string }) {
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productsService.getProductById(productId),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  if (isError || !product) {
    return (
      <EmptyState
        icon={PackageSearchIcon}
        title="Product not found"
        description="This listing may have been removed."
        action={
          <ButtonLink href="/admin/products">Back to products</ButtonLink>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit product"
        description={product.name}
      />
      <ProductForm product={product} />
    </div>
  )
}

export { ProductEditView }
