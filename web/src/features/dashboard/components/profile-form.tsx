"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CameraIcon } from "lucide-react"
import { toast } from "sonner"

import {
  profileSchema,
  changePasswordSchema,
  type ProfileFormValues,
  type ChangePasswordFormValues,
} from "@/schemas/profile.schema"
import { usersService } from "@/services/users.service"
import { useAuthStore } from "@/store/auth-store"
import { getErrorMessage } from "@/lib/errors"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Avatar } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

function ProfileForm() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [isPending, startTransition] = React.useTransition()
  const avatarInputRef = React.useRef<HTMLInputElement>(null)
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      line1: user?.address?.line1 ?? "",
      city: user?.address?.city ?? "",
      state: user?.address?.state ?? "",
      postalCode: user?.address?.postalCode ?? "",
      country: user?.address?.country ?? "United States",
      notifications: user?.preferences.notifications ?? true,
      marketing: user?.preferences.marketing ?? false,
    },
    mode: "onTouched",
  })

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    mode: "onTouched",
  })

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      try {
        const updated = await usersService.updateMe({
          name: values.name,
          phone: values.phone || undefined,
          address: {
            line1: values.line1,
            city: values.city,
            state: values.state,
            postalCode: values.postalCode,
            country: values.country,
          },
          preferences: {
            notifications: values.notifications,
            marketing: values.marketing,
          },
        })
        setUser(updated)
        toast.success("Profile updated")
      } catch {
        toast.error("Couldn't update your profile")
      }
    })
  })

  const onChangePassword = passwordForm.handleSubmit((values) => {
    startTransition(async () => {
      try {
        await usersService.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
        passwordForm.reset()
        toast.success("Password changed")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Couldn't change your password")
      }
    })
  })

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    setUploadingAvatar(true)
    try {
      const updated = await usersService.updateAvatar(file)
      setUser(updated)
      toast.success("Profile photo updated")
    } catch (error) {
      toast.error("Couldn't update your photo", {
        description: getErrorMessage(error),
      })
    } finally {
      setUploadingAvatar(false)
      if (avatarInputRef.current) {
        avatarInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-medium tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-card p-5">
        <div className="relative">
          <Avatar src={user?.avatar} name={user?.name ?? "User"} size="xl" />
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            aria-label="Change profile photo"
            disabled={uploadingAvatar}
            className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-sm transition-colors hover:bg-brand/90 disabled:opacity-50"
          >
            <CameraIcon className="size-4" />
          </button>
        </div>
        <div className="min-w-0">
          <p className="font-heading text-lg font-medium">{user?.name}</p>
          <p className="text-sm text-muted-foreground">
            Member since {user?.joinedAt ? new Date(user.joinedAt).getFullYear() : "—"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium capitalize text-brand">
              {user?.role ?? "buyer"} account
            </span>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="text-xs font-medium text-brand hover:underline disabled:opacity-50"
            >
              {uploadingAvatar ? "Uploading…" : "Change photo"}
            </button>
          </div>
        </div>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
        <FieldSet className="gap-5">
          <FieldLegend className="font-heading text-lg font-medium">Personal details</FieldLegend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="profile-name">Full name</FieldLabel>
                  <Input id="profile-name" autoComplete="name" aria-invalid={!!form.formState.errors.name} {...field} />
                  <FieldError errors={[form.formState.errors.name]} />
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="profile-email">Email</FieldLabel>
                  <Input id="profile-email" type="email" autoComplete="email" aria-invalid={!!form.formState.errors.email} {...field} />
                  <FieldError errors={[form.formState.errors.email]} />
                </Field>
              )}
            />
          </div>
          <Controller
            name="phone"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="profile-phone">Phone</FieldLabel>
                <FieldDescription>Used for delivery coordination.</FieldDescription>
                <Input id="profile-phone" type="tel" autoComplete="tel" aria-invalid={!!form.formState.errors.phone} {...field} />
                <FieldError errors={[form.formState.errors.phone]} />
              </Field>
            )}
          />
        </FieldSet>

        <Separator />

        <FieldSet className="gap-5">
          <FieldLegend className="font-heading text-lg font-medium">Default address</FieldLegend>
          <Controller
            name="line1"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="profile-line1">Street address</FieldLabel>
                <Input id="profile-line1" aria-invalid={!!form.formState.errors.line1} {...field} />
                <FieldError errors={[form.formState.errors.line1]} />
              </Field>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="city"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="profile-city">City</FieldLabel>
                  <Input id="profile-city" aria-invalid={!!form.formState.errors.city} {...field} />
                  <FieldError errors={[form.formState.errors.city]} />
                </Field>
              )}
            />
            <Controller
              name="state"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="profile-state">State / region</FieldLabel>
                  <Input id="profile-state" aria-invalid={!!form.formState.errors.state} {...field} />
                  <FieldError errors={[form.formState.errors.state]} />
                </Field>
              )}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="postalCode"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="profile-postal">Postal code</FieldLabel>
                  <Input id="profile-postal" aria-invalid={!!form.formState.errors.postalCode} {...field} />
                  <FieldError errors={[form.formState.errors.postalCode]} />
                </Field>
              )}
            />
            <Controller
              name="country"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="profile-country">Country</FieldLabel>
                  <Input id="profile-country" aria-invalid={!!form.formState.errors.country} {...field} />
                  <FieldError errors={[form.formState.errors.country]} />
                </Field>
              )}
            />
          </div>
        </FieldSet>

        <Separator />

        <FieldSet className="gap-4">
          <FieldLegend className="font-heading text-lg font-medium">Preferences</FieldLegend>
          <div className="flex flex-col gap-4">
            <Controller
              name="notifications"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Order notifications</p>
                    <p className="text-xs text-muted-foreground">Delivery updates and health reminders.</p>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    aria-label="Order notifications"
                  />
                </div>
              )}
            />
            <Controller
              name="marketing"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Marketing emails</p>
                    <p className="text-xs text-muted-foreground">Weekly drops and farm offers.</p>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    aria-label="Marketing emails"
                  />
                </div>
              )}
            />
          </div>
        </FieldSet>

        <div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>

      <form
        onSubmit={onChangePassword}
        noValidate
        className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6"
      >
        <FieldSet className="gap-5">
          <FieldLegend className="font-heading text-lg font-medium">Change password</FieldLegend>
          <Controller
            name="currentPassword"
            control={passwordForm.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="pw-current">Current password</FieldLabel>
                <Input id="pw-current" type="password" autoComplete="current-password" aria-invalid={!!passwordForm.formState.errors.currentPassword} {...field} />
                <FieldError errors={[passwordForm.formState.errors.currentPassword]} />
              </Field>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="newPassword"
              control={passwordForm.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="pw-new">New password</FieldLabel>
                  <Input id="pw-new" type="password" autoComplete="new-password" aria-invalid={!!passwordForm.formState.errors.newPassword} {...field} />
                  <FieldError errors={[passwordForm.formState.errors.newPassword]} />
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={passwordForm.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="pw-confirm">Confirm new password</FieldLabel>
                  <Input id="pw-confirm" type="password" autoComplete="new-password" aria-invalid={!!passwordForm.formState.errors.confirmPassword} {...field} />
                  <FieldError errors={[passwordForm.formState.errors.confirmPassword]} />
                </Field>
              )}
            />
          </div>
        </FieldSet>
        <div>
          <Button type="submit" variant="outline" disabled={isPending}>
            {isPending ? "Updating…" : "Update password"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export { ProfileForm }
