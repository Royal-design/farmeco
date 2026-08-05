import { ProductEditView } from "@/features/admin/components/product-edit-view"

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ProductEditView productId={id} />
}
