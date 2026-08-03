"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2Icon, MailIcon } from "lucide-react"
import { toast } from "sonner"

import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/schemas/auth.schema"
import { authService } from "@/services/auth.service"
import { Button, ButtonLink } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

function ForgotPasswordForm() {
  const [isPending, startTransition] = React.useTransition()
  const [sentTo, setSentTo] = React.useState<string | null>(null)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  })

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      try {
        const result = await authService.forgotPassword(values)
        setSentTo(result.sentTo)
        toast.success("Reset link sent", {
          description: `Check ${result.sentTo} for instructions.`,
        })
      } catch {
        toast.error("Something went wrong", {
          description: "Please try again in a moment.",
        })
      }
    })
  })

  if (sentTo) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <CheckCircle2Icon className="size-7" />
        </span>
        <h1 className="font-heading text-2xl font-medium">Check your inbox</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          We&apos;ve sent a password reset link to{" "}
          <span className="font-medium text-foreground">{sentTo}</span>. The link
          expires in 30 minutes.
        </p>
        <ButtonLink href="/login" variant="outline" className="mt-2">
          Back to sign in
        </ButtonLink>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <h1 className="font-heading text-3xl font-medium tracking-tight">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your account email and we&apos;ll send you a reset link.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
        <FieldDescription>We&apos;ll never share your email.</FieldDescription>
        <div className="relative">
          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
              <Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="you@farm.com"
                className="pl-9"
                aria-invalid={!!form.formState.errors.email}
                {...field}
              />
            )}
          />
          <MailIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <FieldError errors={[form.formState.errors.email]} />
      </Field>

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Sending link…
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <ButtonLink href="/login" variant="link" size="sm" className="text-brand">
          Sign in
        </ButtonLink>
      </p>
    </form>
  )
}

export { ForgotPasswordForm }
