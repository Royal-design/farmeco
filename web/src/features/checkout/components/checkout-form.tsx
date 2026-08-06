"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CheckCircle2Icon,
  CreditCardIcon,
  BanknoteIcon,
  LockIcon,
  ShieldCheckIcon,
  TruckIcon,
  ChevronLeftIcon,
} from "lucide-react"
import { toast } from "sonner"

import { checkoutSchema, type CheckoutFormValues } from "@/schemas/checkout.schema"
import { useCartStore, selectCartSubtotal, selectCartCount } from "@/store/cart-store"
import { useAuthStore } from "@/store/auth-store"
import { ordersService } from "@/services/orders.service"
import { paymentsService } from "@/services/payments.service"
import { couponsService } from "@/services/coupons.service"
import type { Coupon } from "@/types/order"
import { formatPrice } from "@/utils/format"
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/constants/order"
import { cn } from "@/lib/utils"
import { Button, ButtonLink } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

const paymentMethods = [
  { value: "card", label: "Card (Paystack)", description: "Secure card payment via Paystack", icon: CreditCardIcon },
  { value: "cod", label: "Cash on delivery", description: "Pay when your order arrives", icon: BanknoteIcon },
] as const

function CheckoutForm() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clear)
  const subtotal = useCartStore(selectCartSubtotal)
  const count = useCartStore(selectCartCount)
  const user = useAuthStore((state) => state.user)

  const [appliedCoupon, setAppliedCoupon] = React.useState<Coupon | null>(null)
  const [couponCode, setCouponCode] = React.useState("")
  const [applyingCoupon, setApplyingCoupon] = React.useState(false)
  const [placing, setPlacing] = React.useState(false)
  const [placedOrder, setPlacedOrder] = React.useState<string | null>(null)

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping: {
        fullName: user?.name ?? "",
        phone: user?.phone ?? "",
        line1: user?.address?.line1 ?? "",
        line2: "",
        city: user?.address?.city ?? "",
        state: user?.address?.state ?? "",
        postalCode: user?.address?.postalCode ?? "",
        country: user?.address?.country ?? "United States",
        saveAddress: true,
      },
      payment: {
        method: "card",
        cardNumber: "",
        cardExpiry: "",
        cardCvc: "",
        saveCard: false,
        billingSameAsShipping: true,
      },
      couponCode: "",
      notes: "",
    },
    mode: "onTouched",
  })

  const paymentMethod = form.watch("payment.method")
  const discount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? subtotal * (appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0
  const delivery = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE
  const total = Math.max(0, subtotal - discount) + delivery

  const handleApplyCoupon = async () => {
    const code = couponCode.trim()
    if (!code || applyingCoupon) return
    setApplyingCoupon(true)
    const result = await couponsService.validateCoupon(code, subtotal)
    setApplyingCoupon(false)
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon)
      toast.success(`Coupon ${result.coupon.code} applied!`)
    } else {
      toast.error(result.message ?? "Invalid coupon")
    }
  }

  const onSubmit = form.handleSubmit(async (values) => {
    if (items.length === 0) return
    setPlacing(true)
    try {
      const order = await ordersService.createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod: values.payment.method,
        couponCode: appliedCoupon?.code,
        shippingAddress: values.shipping,
        notes: values.notes,
      })

      if (values.payment.method === "card") {
        const payment = await paymentsService.initialize(order.id)
        window.location.href = payment.authorizationUrl
        return
      }

      clearCart()
      setPlacedOrder(order.number)
    } catch {
      toast.error("Something went wrong placing your order")
      setPlacing(false)
    }
  })

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-brand/8 text-brand">
          <TruckIcon className="size-7" strokeWidth={1.5} />
        </span>
        <h1 className="font-heading text-2xl font-medium">Nothing to check out</h1>
        <p className="text-sm text-muted-foreground">
          Your cart is empty. Add some livestock or farm essentials first.
        </p>
        <ButtonLink href="/shop">Browse marketplace</ButtonLink>
      </div>
    )
  }

  if (placedOrder) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <CheckCircle2Icon className="size-8" />
        </span>
        <h1 className="font-heading text-3xl font-medium">Order placed!</h1>
        <p className="text-sm text-muted-foreground">
          Your order <span className="font-semibold text-foreground">{placedOrder}</span> is
          confirmed. The seller will reach out within 24 hours to schedule delivery.
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

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <button
        type="button"
        onClick={() => router.push("/cart")}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeftIcon className="size-4" />
        Back to cart
      </button>

      <h1 className="mb-8 font-heading text-3xl font-medium tracking-tight">
        Checkout
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-10">
          <FieldSet className="gap-5">
            <FieldLegend className="flex items-center gap-3 font-heading text-lg font-medium">
              <span className="flex size-7 items-center justify-center rounded-full bg-brand text-sm text-brand-foreground">1</span>
              Shipping details
            </FieldLegend>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="shipping.fullName"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="shipping-fullName">Full name</FieldLabel>
                    <Input id="shipping-fullName" aria-invalid={!!form.formState.errors.shipping?.fullName} {...field} />
                    <FieldError errors={[form.formState.errors.shipping?.fullName]} />
                  </Field>
                )}
              />
              <Controller
                name="shipping.phone"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="shipping-phone">Phone</FieldLabel>
                    <Input id="shipping-phone" type="tel" aria-invalid={!!form.formState.errors.shipping?.phone} {...field} />
                    <FieldError errors={[form.formState.errors.shipping?.phone]} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="shipping.line1"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="shipping-line1">Street address</FieldLabel>
                  <Input id="shipping-line1" aria-invalid={!!form.formState.errors.shipping?.line1} {...field} />
                  <FieldError errors={[form.formState.errors.shipping?.line1]} />
                </Field>
              )}
            />
            <Controller
              name="shipping.line2"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="shipping-line2">Apartment, suite, farm name (optional)</FieldLabel>
                  <Input id="shipping-line2" {...field} />
                </Field>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="shipping.city"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="shipping-city">City</FieldLabel>
                    <Input id="shipping-city" aria-invalid={!!form.formState.errors.shipping?.city} {...field} />
                    <FieldError errors={[form.formState.errors.shipping?.city]} />
                  </Field>
                )}
              />
              <Controller
                name="shipping.state"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="shipping-state">State / region</FieldLabel>
                    <Input id="shipping-state" aria-invalid={!!form.formState.errors.shipping?.state} {...field} />
                    <FieldError errors={[form.formState.errors.shipping?.state]} />
                  </Field>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="shipping.postalCode"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="shipping-postal">Postal code</FieldLabel>
                    <Input id="shipping-postal" aria-invalid={!!form.formState.errors.shipping?.postalCode} {...field} />
                    <FieldError errors={[form.formState.errors.shipping?.postalCode]} />
                  </Field>
                )}
              />
              <Controller
                name="shipping.country"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="shipping-country">Country</FieldLabel>
                    <Input id="shipping-country" aria-invalid={!!form.formState.errors.shipping?.country} {...field} />
                    <FieldError errors={[form.formState.errors.shipping?.country]} />
                  </Field>
                )}
              />
            </div>
          </FieldSet>

          <Separator />

          <FieldSet className="gap-5">
            <FieldLegend className="flex items-center gap-3 font-heading text-lg font-medium">
              <span className="flex size-7 items-center justify-center rounded-full bg-brand text-sm text-brand-foreground">2</span>
              Payment method
            </FieldLegend>

            <Controller
              name="payment.method"
              control={form.control}
              render={({ field }) => (
                <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Payment method">
                  {paymentMethods.map((method) => {
                    const active = field.value === method.value
                    return (
                      <button
                        key={method.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => field.onChange(method.value)}
                        className={cn(
                          "flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-all",
                          active
                            ? "border-brand bg-brand/5 ring-2 ring-brand/15"
                            : "border-border hover:border-brand/30"
                        )}
                      >
                        <method.icon className={cn("size-5", active ? "text-brand" : "text-muted-foreground")} />
                        <span className="text-sm font-medium">{method.label}</span>
                        <span className="text-xs text-muted-foreground">{method.description}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            />
            <FieldError errors={[form.formState.errors.payment?.method]} />

            {paymentMethod === "card" && (
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
                <ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-brand" />
                <div>
                  <p className="font-medium text-foreground">
                    Secured by Paystack
                  </p>
                  <p className="mt-1">
                    After placing your order you&apos;ll be redirected to
                    Paystack&apos;s secure checkout to complete your card payment.
                  </p>
                </div>
              </div>
            )}
          </FieldSet>

          <FieldSet className="gap-4">
            <FieldLegend className="flex items-center gap-3 font-heading text-lg font-medium">
              <span className="flex size-7 items-center justify-center rounded-full bg-brand text-sm text-brand-foreground">3</span>
              Notes (optional)
            </FieldLegend>
            <Controller
              name="notes"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="checkout-notes">Delivery instructions</FieldLabel>
                  <FieldDescription>
                    Feeding preferences, access notes for the haulier, or a preferred delivery window.
                  </FieldDescription>
                  <Textarea id="checkout-notes" rows={3} {...field} />
                </Field>
              )}
            />
          </FieldSet>

          <div className="flex items-center justify-between gap-4 rounded-xl bg-brand/5 p-3.5 text-xs text-brand/90">
            <span className="flex items-center gap-2">
              <LockIcon className="size-4 shrink-0" />
              Payments are encrypted and handled securely.
            </span>
          </div>

          <Button type="submit" size="lg" disabled={placing} className="w-full sm:w-auto">
            {placing ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Placing order…
              </>
            ) : (
              <>
                Place order · {formatPrice(total)}
              </>
            )}
          </Button>
        </form>

        <aside className="lg:sticky lg:top-36 lg:self-start">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-medium">
              Order summary <span className="text-sm font-normal text-muted-foreground">({count})</span>
            </h2>

            <ul className="flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3">
                  <span className="relative size-12 shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="rounded-lg object-cover"
                      />
                    ) : null}
                    <span className="absolute -top-1.5 -right-1.5 flex size-4.5 items-center justify-center rounded-full bg-foreground text-[0.6rem] font-semibold text-background">
                      {item.quantity}
                    </span>
                  </span>
                  <span className="line-clamp-1 min-w-0 flex-1 text-sm">{item.name}</span>
                  <span className="text-sm font-medium tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className={cn("tabular-nums", delivery === 0 && "text-brand")}>
                  {delivery === 0 ? "Free" : formatPrice(delivery)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="tabular-nums">−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-base">
                <span className="font-medium">Total</span>
                <span className="font-semibold tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  aria-label="Coupon code"
                  className="h-9"
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleApplyCoupon} disabled={!couponCode.trim() || applyingCoupon}>
                {applyingCoupon ? "…" : "Apply"}
              </Button>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
              <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-brand" />
              Every animal includes a 7-day health guarantee and complete paperwork.
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export { CheckoutForm }
