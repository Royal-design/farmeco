import { PageHeader } from "@/features/admin/components/page-header"
import { ProductForm } from "@/features/admin/components/product-form"

export default function AdminNewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add product"
        description="Create a new listing with badges and publish status."
      />
      <ProductForm />
    </div>
  )
}
