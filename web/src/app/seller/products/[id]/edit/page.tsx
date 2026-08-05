import { ProductEditView } from "@/features/admin/components/product-edit-view"

export default async function SellerEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ProductEditView productId={id} />
}
