"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import type { Coupon } from "@/types/order"
import { couponsService } from "@/services/coupons.service"
import { getErrorMessage } from "@/lib/errors"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CouponFormProps {
  initial?: Coupon | null
  onSuccess?: () => void
  onCancel?: () => void
}

interface CouponFormValues {
  code: string
  value: string
  minOrder: string
  description: string
  expiresAt: string
}

function toLocalInput(iso?: string) {
  return iso ? iso.slice(0, 16) : ""
}

function CouponForm({ initial, onSuccess, onCancel }: CouponFormProps) {
  const [type, setType] = React.useState<Coupon["type"]>(initial?.type ?? "percent")
  const [active, setActive] = React.useState(true)

  const form = useForm<CouponFormValues>({
    defaultValues: {
      code: initial?.code ?? "",
      value: initial ? String(initial.value) : "",
      minOrder: initial ? String(initial.minOrder) : "0",
      description: initial?.description ?? "",
      expiresAt: toLocalInput(initial?.expiresAt),
    },
  })

  const mutation = useMutation({
    mutationFn: (values: CouponFormValues) => {
      const payload = {
        code: values.code.trim().toUpperCase(),
        type,
        value: Number(values.value),
        minOrder: Number(values.minOrder) || 0,
        description: values.description || undefined,
        expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : undefined,
      }
      return initial
        ? couponsService.updateCoupon(initial.id, { ...payload, isActive: active })
        : couponsService.createCoupon(payload)
    },
    onSuccess: () => {
      toast.success(initial ? "Coupon updated" : "Coupon created")
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(initial ? "Couldn't update coupon" : "Couldn't create coupon", {
        description: getErrorMessage(error),
      })
    },
  })

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values))

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="code"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="coupon-code">Code</FieldLabel>
              <FieldError errors={[{ message: form.formState.errors.code?.message }]} />
              <Input id="coupon-code" placeholder="WELCOME10" {...field} />
            </Field>
          )}
        />
        <Field>
          <FieldLabel htmlFor="coupon-type">Type</FieldLabel>
          <Select
            value={type}
            onValueChange={(value) => setType(value as Coupon["type"])}
            items={[
              { value: "percent", label: "Percentage (%)" },
              { value: "fixed", label: "Fixed amount (₦)" },
            ]}
          >
            <SelectTrigger id="coupon-type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percent">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed amount (₦)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="value"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="coupon-value">
                Value {type === "percent" ? "(%)" : "(₦)"}
              </FieldLabel>
              <FieldError errors={[{ message: form.formState.errors.value?.message }]} />
              <Input id="coupon-value" type="number" min={1} step="any" {...field} />
            </Field>
          )}
        />
        <Controller
          name="minOrder"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="coupon-min">Minimum order (₦)</FieldLabel>
              <Input id="coupon-min" type="number" min={0} step="any" {...field} />
            </Field>
          )}
        />
      </div>
      <Controller
        name="expiresAt"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="coupon-expiry">Expires at</FieldLabel>
            <FieldError errors={[{ message: form.formState.errors.expiresAt?.message }]} />
            <Input id="coupon-expiry" type="datetime-local" {...field} />
          </Field>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="coupon-description">Description</FieldLabel>
            <Textarea id="coupon-description" rows={2} {...field} />
          </Field>
        )}
      />
      <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 px-3.5 py-2.5">
        <div>
          <p className="text-sm font-medium">Active</p>
          <p className="text-xs text-muted-foreground">Allow this coupon to be used</p>
        </div>
        <Switch checked={active} onCheckedChange={setActive} aria-label="Coupon active" />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : initial ? "Save changes" : "Create coupon"}
        </Button>
      </div>
    </form>
  )
}

export { CouponForm }
