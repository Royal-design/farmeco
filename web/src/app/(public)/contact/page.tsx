import type { Metadata } from "next"
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon } from "lucide-react"

import { siteConfig } from "@/config/site"
import { PageHeader } from "@/components/shared/page-header"
import { ContactForm } from "@/features/contact/components/contact-form"
import { GradientOrb } from "@/components/shared/gradient-orb"

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Get in touch with the Pasture & Co. team — order support, seller enquiries, or feedback.",
  alternates: { canonical: "/contact" },
}

const channels = [
  { icon: MailIcon, label: "Email", value: siteConfig.supportEmail },
  { icon: PhoneIcon, label: "Phone", value: siteConfig.phone },
  { icon: MapPinIcon, label: "Visit", value: siteConfig.location },
  { icon: ClockIcon, label: "Hours", value: "Mon–Sat, 8am–6pm" },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Questions about an order, or ready to list your farm? Our team replies within 24 hours."
        crumbs={[{ label: "Contact" }]}
      />
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <GradientOrb variant="honey" className="-top-10 right-0 opacity-30" />
        <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
          <div className="flex flex-col gap-4">
            {channels.map((channel) => (
              <div
                key={channel.label}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <channel.icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {channel.label}
                  </p>
                  <p className="text-sm font-medium">{channel.value}</p>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/8 to-moss/8 p-5">
              <h2 className="font-heading text-lg font-medium">Selling with us?</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                We onboard new farms every month. Get in touch and our seller
                team will walk you through listing, health records and delivery.
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </>
  )
}
