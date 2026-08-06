"use client"

import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { TruckIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { shippingService } from "@/services/shipping.service"
import { getErrorMessage } from "@/lib/errors"
import { formatPrice } from "@/utils/format"
import { PageHeader } from "@/features/admin/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

function DeliverySettingsView() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["shipping", "settings"],
    queryFn: shippingService.getSettings,
  })

  const mutation = useMutation({
    mutationFn: (input: { freeShippingThreshold: number; flatRate: number }) =>
      shippingService.updateSettings(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["shipping", "settings"], updated)
      toast.success("Delivery fees saved")
    },
    onError: (error) => {
      toast.error("Couldn't save delivery fees", {
        description: getErrorMessage(error),
      })
    },
  })

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Delivery settings"
          description="Set the delivery fees used across checkout and the cart."
        />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const threshold = Number(form.get("freeThreshold"))
    const rate = Number(form.get("flatRate"))

    if (!Number.isFinite(threshold) || threshold < 0) {
      toast.error("Enter a valid free-shipping threshold")
      return
    }
    if (!Number.isFinite(rate) || rate < 0) {
      toast.error("Enter a valid flat rate")
      return
    }

    mutation.mutate({
      freeShippingThreshold: threshold,
      flatRate: rate,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Delivery settings"
        description="Set the delivery fees used across checkout and the cart."
      />

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <TruckIcon className="size-5" />
        </span>
        <p>
          Currently:{" "}
          <span className="font-medium text-foreground">
            {formatPrice(data.freeShippingThreshold)}
          </span>{" "}
          free-shipping threshold ·{" "}
          <span className="font-medium text-foreground">{formatPrice(data.flatRate)}</span>{" "}
          flat rate. Orders at or above the threshold ship free.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex max-w-md flex-col gap-5 rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="free-threshold">Free-shipping threshold (₦)</Label>
          <Input
            id="free-threshold"
            name="freeThreshold"
            inputMode="numeric"
            defaultValue={String(data.freeShippingThreshold)}
            placeholder="200000"
          />
          <p className="text-xs text-muted-foreground">
            Orders at or above this subtotal pay no delivery fee.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="flat-rate">Flat delivery rate (₦)</Label>
          <Input
            id="flat-rate"
            name="flatRate"
            inputMode="numeric"
            defaultValue={String(data.flatRate)}
            placeholder="15000"
          />
          <p className="text-xs text-muted-foreground">
            Charged on orders below the free-shipping threshold.
          </p>
        </div>

        <Button type="submit" disabled={mutation.isPending} className="self-start">
          {mutation.isPending ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving…
            </>
          ) : (
            <>
              <SaveIcon className="size-4" />
              Save changes
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

export { DeliverySettingsView }
