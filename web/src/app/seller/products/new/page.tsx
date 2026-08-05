import { PageHeader } from "@/features/admin/components/page-header"
import { ProductForm } from "@/features/admin/components/product-form"

export default function SellerNewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add product"
        description="List a new animal or farm essential."
      />
      <ProductForm backHref="/seller/products" />
    </div>
  )
}
