"use client"

import { useAuthStore } from "@/store/auth-store"
import { ProductsView } from "@/features/admin/components/products-view"

function SellerProductsPage() {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return null
  }

  return <ProductsView basePath="/seller/products" sellerId={user.id} />
}

export { SellerProductsPage }
