"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreditCardIcon, ShieldCheckIcon, BellIcon, LaptopIcon, SmartphoneIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import {
  settingsSchema,
  paymentMethodSchema,
  type SettingsFormValues,
  type PaymentMethodFormValues,
} from "@/schemas/settings.schema"
import { settingsService } from "@/services/settings.service"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { formatDate } from "@/utils/format"

function NotificationsCard() {
  const queryClient = useQueryClient()
  const [isPending, startTransition] = React.useTransition()

  const { data, isLoading } = useQuery({
    queryKey: ["settings", "notifications"],
    queryFn: settingsService.getNotifications,
  })

  const mutation = useMutation({
    mutationFn: settingsService.updateNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "notifications"] })
      toast.success("Notification preferences saved")
    },
  })

  if (isLoading || !data) {
    return (
      <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    )
  }

  const update = (key: keyof SettingsFormValues) => (checked: boolean) => {
    mutation.mutate({ ...data, [key]: checked })
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 font-heading text-lg font-medium">
        <BellIcon className="size-4 text-brand" />
        Notifications
      </h2>
      <div className="flex flex-col gap-4">
        <ToggleRow
          label="Order updates"
          description="Delivery windows, tracking and status changes."
          checked={data.orderUpdates}
          onChange={update("orderUpdates")}
        />
        <ToggleRow
          label="Price drops"
          description="When a saved listing drops in price."
          checked={data.priceDrops}
          onChange={update("priceDrops")}
        />
        <ToggleRow
          label="New arrivals"
          description="Fresh livestock and essentials in your categories."
          checked={data.newArrivals}
          onChange={update("newArrivals")}
        />
        <ToggleRow
          label="Weekly digest"
          description="A short email with the week's best listings."
          checked={data.weeklyDigest}
          onChange={update("weeklyDigest")}
        />
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  )
}

function SecurityCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["settings", "security"],
    queryFn: settingsService.getSecurity,
  })

  const [twoFactorOverride, setTwoFactorOverride] = React.useState<boolean | null>(null)
  const twoFactor = twoFactorOverride ?? data?.twoFactor ?? false

  const toggleTwoFactor = () => {
    if (!twoFactor) {
      settingsService.enableTwoFactor().then(() => {
        setTwoFactorOverride(true)
        toast.success("Two-factor authentication enabled")
      })
    } else {
      setTwoFactorOverride(false)
      toast.success("Two-factor authentication disabled")
    }
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 font-heading text-lg font-medium">
        <ShieldCheckIcon className="size-4 text-brand" />
        Security
      </h2>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Two-factor authentication</p>
          <p className="text-xs text-muted-foreground">
            Add an extra layer of security with an authenticator app.
          </p>
        </div>
        <Switch checked={twoFactor} onCheckedChange={toggleTwoFactor} aria-label="Two-factor authentication" />
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Active sessions
        </h3>
        <ul className="flex flex-col gap-2">
          {data.sessions.map((session) => (
            <li key={session.id} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                {session.device.includes("iPhone") || session.device.includes("Android") ? (
                  <SmartphoneIcon className="size-4" />
                ) : (
                  <LaptopIcon className="size-4" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-medium">
                  {session.device}
                  {session.active && (
                    <span className="size-1.5 rounded-full bg-emerald-500" aria-label="Active now" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.location} · Last active {formatDate(session.lastActive)}
                </p>
              </div>
              {!session.active && (
                <button
                  type="button"
                  className="text-xs font-medium text-destructive hover:underline"
                  onClick={() => toast.success("Session revoked")}
                >
                  Revoke
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PaymentMethodsCard() {
  const queryClient = useQueryClient()
  const [addOpen, setAddOpen] = React.useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["settings", "payments"],
    queryFn: settingsService.getPaymentMethods,
  })

  const addMutation = useMutation({
    mutationFn: settingsService.addPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "payments"] })
      setAddOpen(false)
      toast.success("Payment method added")
    },
  })

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: { number: "", expiry: "", cvc: "" },
    mode: "onTouched",
  })

  const onSubmit = form.handleSubmit((values) => {
    addMutation.mutate({
      number: values.number.replace(/\s/g, ""),
      expiry: values.expiry,
      cvc: values.cvc,
    })
  })

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-lg font-medium">
          <CreditCardIcon className="size-4 text-brand" />
          Payment methods
        </h2>
        <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
          <PlusIcon className="size-3.5" />
          Add card
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <ul className="flex flex-col gap-2">
          {data?.map((method) => (
            <li key={method.id} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-muted font-heading text-lg text-muted-foreground">
                {method.brand[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {method.brand} •••• {method.last4}
                  {method.isDefault && (
                    <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-[0.65rem] font-medium text-brand">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${method.brand} card`}
                className="text-muted-foreground transition-colors hover:text-destructive"
                onClick={() => toast.success("Payment method removed")}
              >
                <Trash2Icon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add payment method</DialogTitle>
            <DialogDescription>
              We never store your card number — it&apos;s tokenised securely.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            <Controller
              name="number"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="pm-number">Card number</FieldLabel>
                  <Input
                    id="pm-number"
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    className="font-mono"
                    aria-invalid={!!form.formState.errors.number}
                    {...field}
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, "").slice(0, 16)
                      field.onChange(digits.replace(/(\d{4})(?=\d)/g, "$1 "))
                    }}
                  />
                  <FieldError errors={[form.formState.errors.number]} />
                </Field>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="expiry"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="pm-expiry">Expiry</FieldLabel>
                    <Input
                      id="pm-expiry"
                      placeholder="MM/YY"
                      className="font-mono"
                      aria-invalid={!!form.formState.errors.expiry}
                      {...field}
                      onChange={(event) => {
                        const raw = event.target.value.replace(/\D/g, "").slice(0, 4)
                        field.onChange(raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw)
                      }}
                    />
                    <FieldError errors={[form.formState.errors.expiry]} />
                  </Field>
                )}
              />
              <Controller
                name="cvc"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="pm-cvc">CVC</FieldLabel>
                    <Input
                      id="pm-cvc"
                      inputMode="numeric"
                      placeholder="123"
                      maxLength={4}
                      className="font-mono"
                      aria-invalid={!!form.formState.errors.cvc}
                      {...field}
                      onChange={(event) => field.onChange(event.target.value.replace(/\D/g, ""))}
                    />
                    <FieldError errors={[form.formState.errors.cvc]} />
                  </Field>
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending ? "Adding…" : "Add card"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SettingsView() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-medium tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Notifications, security and payment preferences.
        </p>
      </div>
      <NotificationsCard />
      <SecurityCard />
      <PaymentMethodsCard />
    </div>
  )
}

export { SettingsView }
