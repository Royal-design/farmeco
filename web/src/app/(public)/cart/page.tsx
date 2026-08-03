import type { Metadata } from "next"

import { CartPage } from "@/features/cart/components/cart-page"

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the items in your cart before checking out.",
  alternates: { canonical: "/cart" },
}

export default function CartPageRoute() {
  return <CartPage />
}
