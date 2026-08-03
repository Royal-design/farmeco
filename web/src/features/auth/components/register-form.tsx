"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { toast } from "sonner"

import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema"
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

function RegisterForm() {
  const router = useRouter()
  const register = useAuthStore((state) => state.register)
  const status = useAuthStore((state) => state.status)
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
    mode: "onTouched",
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await register(values.name, values.email, values.password)
      toast.success("Account created — welcome to the farm!")
      router.push("/account")
      router.refresh()
    } catch {
      toast.error("Couldn't create your account", {
        description: "Please try again in a moment.",
      })
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <h1 className="font-heading text-3xl font-medium tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Join thousands of farmers buying and selling healthy livestock.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="register-name">Full name</FieldLabel>
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <Input
              id="register-name"
              autoComplete="name"
              placeholder="Avery Collins"
              aria-invalid={!!form.formState.errors.name}
              {...field}
            />
          )}
        />
        <FieldError errors={[form.formState.errors.name]} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="register-email">Email</FieldLabel>
          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
              <Input
                id="register-email"
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
          <FieldLabel htmlFor="register-phone">Phone (optional)</FieldLabel>
          <Controller
            name="phone"
            control={form.control}
            render={({ field }) => (
              <Input
                id="register-phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
                aria-invalid={!!form.formState.errors.phone}
                {...field}
              />
            )}
          />
          <FieldError errors={[form.formState.errors.phone]} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="register-password">Password</FieldLabel>
        <FieldDescription>At least 8 characters, with letters and numbers.</FieldDescription>
        <div className="relative">
          <Controller
            name="password"
            control={form.control}
            render={({ field }) => (
              <Input
                id="register-password"
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
        <FieldLabel htmlFor="register-confirm">Confirm password</FieldLabel>
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <Input
              id="register-confirm"
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

      <Controller
        name="agree"
        control={form.control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <Checkbox
              id="register-agree"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              aria-invalid={!!form.formState.errors.agree}
            />
            <FieldLabel htmlFor="register-agree" className="font-normal">
              I agree to the{" "}
              <ButtonLink href="/terms" variant="link" size="xs" className="text-brand">
                Terms of Service
              </ButtonLink>{" "}
              and{" "}
              <ButtonLink href="/privacy" variant="link" size="xs" className="text-brand">
                Privacy Policy
              </ButtonLink>
            </FieldLabel>
            <FieldError errors={[form.formState.errors.agree]} />
          </Field>
        )}
      />

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading" || form.formState.isSubmitting}
      >
        {status === "loading" ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <ButtonLink href="/login" variant="link" size="sm" className="text-brand">
          Sign in
        </ButtonLink>
      </p>
    </form>
  )
}

export { RegisterForm }
