"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { toast } from "sonner"

import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema"
import { useAuthStore } from "@/store/auth-store"
import { Button, ButtonLink } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const login = useAuthStore((state) => state.login)
  const status = useAuthStore((state) => state.status)
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
    mode: "onTouched",
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values.email, values.password)
      toast.success("Welcome back!")
      const redirect = searchParams.get("redirect")
      router.push(redirect && redirect.startsWith("/") ? redirect : "/account")
      router.refresh()
    } catch {
      toast.error("Couldn't sign in", {
        description: "Check your email and password and try again.",
      })
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <h1 className="font-heading text-3xl font-medium tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to manage orders, wishlists and delivery details.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="login-email">Email</FieldLabel>
        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@farm.com"
              aria-invalid={!!form.formState.errors.email}
              {...field}
            />
          )}
        />
        <FieldError errors={[form.formState.errors.email]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="login-password">Password</FieldLabel>
        <div className="relative">
          <Controller
            name="password"
            control={form.control}
            render={({ field }) => (
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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

      <div className="flex items-center justify-between gap-3">
        <Controller
          name="remember"
          control={form.control}
          render={({ field }) => (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              Remember me
            </label>
          )}
        />
        <ButtonLink href="/forgot-password" variant="link" size="sm">
          Forgot password?
        </ButtonLink>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading" || form.formState.isSubmitting}
      >
        {status === "loading" ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to Pasture & Co.?{" "}
        <ButtonLink href="/register" variant="link" size="sm" className="text-brand">
          Create an account
        </ButtonLink>
      </p>
    </form>
  )
}

export { LoginForm }
