"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2Icon, EyeIcon, EyeOffIcon } from "lucide-react"
import { toast } from "sonner"

import { resetPasswordSchema, type ResetPasswordFormValues } from "@/schemas/auth.schema"
import { authService } from "@/services/auth.service"
import { Button, ButtonLink } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

function ResetPasswordForm() {
  const [isPending, startTransition] = React.useTransition()
  const [showPassword, setShowPassword] = React.useState(false)
  const [done, setDone] = React.useState(false)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onTouched",
  })

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      try {
        await authService.resetPassword({
          token: typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") ?? "" : "",
          password: values.password,
        })
        setDone(true)
        toast.success("Password updated!")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Couldn't reset your password")
      }
    })
  })

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <CheckCircle2Icon className="size-7" />
        </span>
        <h1 className="font-heading text-2xl font-medium">Password reset</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your password has been updated. You can now sign in with your new
          password.
        </p>
        <ButtonLink href="/login" className="mt-2">
          Sign in
        </ButtonLink>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <h1 className="font-heading text-3xl font-medium tracking-tight">Set a new password</h1>
        <p className="text-sm text-muted-foreground">
          Choose a strong password you haven&apos;t used before.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="reset-password">New password</FieldLabel>
        <FieldDescription>At least 8 characters, with letters and numbers.</FieldDescription>
        <div className="relative">
          <Controller
            name="password"
            control={form.control}
            render={({ field }) => (
              <Input
                id="reset-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className="pr-10"
                aria-invalid={!!form.formState.errors.password}
                {...field}
              />
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </button>
        </div>
        <FieldError errors={[form.formState.errors.password]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="reset-confirm">Confirm new password</FieldLabel>
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <Input
              id="reset-confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!form.formState.errors.confirmPassword}
              {...field}
            />
          )}
        />
        <FieldError errors={[form.formState.errors.confirmPassword]} />
      </Field>

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Updating…
          </>
        ) : (
          "Update password"
        )}
      </Button>
    </form>
  )
}

export { ResetPasswordForm }
