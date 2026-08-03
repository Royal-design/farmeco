"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"
import { SendIcon } from "lucide-react"

import { newsletterSchema, type NewsletterFormValues } from "@/schemas/contact.schema"
import { contactService } from "@/services/contact.service"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  })

  const onSubmit = form.handleSubmit(async (values) => {
    startTransition(async () => {
      try {
        await contactService.subscribeNewsletter(values.email)
        toast.success("You're on the list!", {
          description: "Expect our weekly listings every Thursday.",
        })
        form.reset()
      } catch {
        toast.error("Something went wrong", {
          description: "Please try again in a moment.",
        })
      }
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-md">
      <Field>
        <FieldLabel htmlFor="newsletter-email" className="sr-only">
          Email address
        </FieldLabel>
        <InputGroup className={compact ? "h-11" : "h-11"}>
          <InputGroupAddon align="inline-start">
            <InputGroupText>✉️</InputGroupText>
          </InputGroupAddon>
          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
              <InputGroupInput
                id="newsletter-email"
                type="email"
                placeholder="you@farm.com"
                aria-invalid={!!form.formState.errors.email}
                className="h-10"
                {...field}
              />
            )}
          />
          <InputGroupAddon align="inline-end">
            <Button
              type="submit"
              size="icon-sm"
              disabled={isPending}
              aria-label="Subscribe"
            >
              {isPending ? (
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <SendIcon className="size-3.5" />
              )}
            </Button>
          </InputGroupAddon>
        </InputGroup>
        {form.formState.errors.email && (
          <FieldError>{form.formState.errors.email.message}</FieldError>
        )}
      </Field>
    </form>
  )
}

export { NewsletterForm }
