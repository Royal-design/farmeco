"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2Icon, SendIcon } from "lucide-react"
import { toast } from "sonner"

import { contactSchema, type ContactFormValues } from "@/schemas/contact.schema"
import { contactService } from "@/services/contact.service"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function ContactForm() {
  const [isPending, startTransition] = React.useTransition()
  const [ticket, setTicket] = React.useState<string | null>(null)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
    mode: "onTouched",
  })

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      try {
        const result = await contactService.sendMessage(values)
        setTicket(result.ticket)
        toast.success("Message sent", {
          description: `Ticket ${result.ticket} created. We'll reply within 24 hours.`,
        })
        form.reset()
      } catch {
        toast.error("Couldn't send your message", {
          description: "Please try again in a moment.",
        })
      }
    })
  })

  if (ticket) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <CheckCircle2Icon className="size-7" />
        </span>
        <h3 className="font-heading text-xl font-medium">We received your message</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Reference <span className="font-semibold text-foreground">{ticket}</span>. A
          member of the team will get back to you within 24 hours.
        </p>
        <Button variant="outline" onClick={() => setTicket(null)}>
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="contact-name">Name</FieldLabel>
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <Input
                id="contact-name"
                autoComplete="name"
                placeholder="Your name"
                aria-invalid={!!form.formState.errors.name}
                {...field}
              />
            )}
          />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
              <Input
                id="contact-email"
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
      </div>

      <Field>
        <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
        <FieldDescription>Tell us what this is about — orders, selling, or support.</FieldDescription>
        <Controller
          name="subject"
          control={form.control}
          render={({ field }) => (
            <Input
              id="contact-subject"
              placeholder="How can we help?"
              aria-invalid={!!form.formState.errors.subject}
              {...field}
            />
          )}
        />
        <FieldError errors={[form.formState.errors.subject]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="contact-message">Message</FieldLabel>
        <Controller
          name="message"
          control={form.control}
          render={({ field }) => (
            <Textarea
              id="contact-message"
              rows={6}
              placeholder="Write your message…"
              aria-invalid={!!form.formState.errors.message}
              {...field}
            />
          )}
        />
        <FieldError errors={[form.formState.errors.message]} />
      </Field>

      <Button type="submit" size="lg" disabled={isPending} className="w-fit">
        {isPending ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Sending…
          </>
        ) : (
          <>
            Send message
            <SendIcon className="size-4" />
          </>
        )}
      </Button>
    </form>
  )
}

export { ContactForm }
