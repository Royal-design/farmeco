import type { Metadata } from "next"

import { CheckoutGuard } from "@/features/checkout/components/checkout-guard"
import { CheckoutForm } from "@/features/checkout/components/checkout-form"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your livestock purchase securely.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: true },
}

export default function CheckoutPage() {
  return (
    <CheckoutGuard>
      <CheckoutForm />
    </CheckoutGuard>
  )
}
