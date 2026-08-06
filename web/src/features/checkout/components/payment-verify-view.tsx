"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2Icon, XCircleIcon, LoaderCircleIcon } from "lucide-react"

import { paymentsService } from "@/services/payments.service"
import { useCartStore } from "@/store/cart-store"
import { ButtonLink } from "@/components/ui/button"

function PaymentVerifyView() {
  const searchParams = useSearchParams()
  const clearCart = useCartStore((state) => state.clear)
  const reference = searchParams.get("reference") ?? searchParams.get("trxref")

  const { data, isError, isSuccess, isPending } = useQuery({
    queryKey: ["payment", "verify", reference],
    queryFn: () => paymentsService.verify(reference ?? ""),
    enabled: Boolean(reference),
  })

  React.useEffect(() => {
    if (isSuccess) {
      clearCart()
    }
  }, [isSuccess, clearCart])

  if (!reference) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <XCircleIcon className="size-8" />
        </span>
        <h1 className="font-heading text-3xl font-medium">Payment could not be verified</h1>
        <p className="text-sm text-muted-foreground">
          No payment reference was provided. If you were charged, check your orders.
        </p>
        <ButtonLink href="/account/orders">View my orders</ButtonLink>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <span className="flex size-16 animate-spin items-center justify-center text-brand">
          <LoaderCircleIcon className="size-8" />
        </span>
        <h1 className="font-heading text-3xl font-medium">Verifying payment…</h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we confirm your payment with Paystack.
        </p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <XCircleIcon className="size-8" />
        </span>
        <h1 className="font-heading text-3xl font-medium">Payment not confirmed</h1>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t confirm the payment. If you were charged, contact support with your reference.
        </p>
        <ButtonLink href="/account/orders">View my orders</ButtonLink>
      </div>
    )
  }

  const paid = data.paymentStatus === "paid"

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
      <span
        className={`flex size-16 items-center justify-center rounded-full ${
          paid
            ? "bg-emerald-500/10 text-emerald-600"
            : "bg-amber-500/10 text-amber-600"
        }`}
      >
        {paid ? <CheckCircle2Icon className="size-8" /> : <LoaderCircleIcon className="size-8" />}
      </span>
      <h1 className="font-heading text-3xl font-medium">
        {paid ? "Payment successful!" : "Payment still processing"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {paid
          ? `Your payment for order ${data.order.number} was received.`
          : "Your payment is being confirmed. Check your orders shortly."}
      </p>
      <div className="mt-2 flex gap-3">
        <ButtonLink href="/account/orders">View my orders</ButtonLink>
        <ButtonLink href="/shop" variant="outline">
          Keep browsing
        </ButtonLink>
      </div>
    </div>
  )
}

export { PaymentVerifyView }
