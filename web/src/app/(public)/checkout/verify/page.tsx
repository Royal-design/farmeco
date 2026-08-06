import { Suspense } from "react"

import { PaymentVerifyView } from "@/features/checkout/components/payment-verify-view"

export const metadata = {
  title: "Payment verification",
  alternates: { canonical: "/checkout/verify" },
}

export default function CheckoutVerifyPage() {
  return (
    <div className="min-h-screen">
      <Suspense>
        <PaymentVerifyView />
      </Suspense>
    </div>
  )
}
