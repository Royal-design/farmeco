"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ShieldCheckIcon, BellIcon, LaptopIcon, SmartphoneIcon } from "lucide-react"
import { toast } from "sonner"

import {
  settingsSchema,
  type SettingsFormValues,
} from "@/schemas/settings.schema"
import { settingsService } from "@/services/settings.service"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
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

function SettingsView() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-medium tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Notifications and security preferences.
        </p>
      </div>
      <NotificationsCard />
      <SecurityCard />
    </div>
  )
}

export { SettingsView }
