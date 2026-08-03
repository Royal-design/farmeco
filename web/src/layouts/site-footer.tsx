"use client"

import * as React from "react"
import Link from "next/link"
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react"

import { footerLinks, siteConfig } from "@/config/site"
import { Logo } from "@/components/shared/logo"
import { NewsletterForm } from "@/features/newsletter/components/newsletter-form"

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[color:oklch(0.955_0.01_95)] dark:bg-[color:oklch(0.2_0.015_165)]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm space-y-5">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}. Verified sellers, health-certified animals
              and carbon-conscious doorstep delivery — the modern way to farm.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MailIcon className="size-4 text-brand" />
                {siteConfig.supportEmail}
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon className="size-4 text-brand" />
                {siteConfig.phone}
              </li>
              <li className="flex items-center gap-2">
                <MapPinIcon className="size-4 text-brand" />
                {siteConfig.location}
              </li>
            </ul>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <FooterColumn title="Marketplace" links={footerLinks.marketplace} />
            <FooterColumn title="Company" links={footerLinks.company} />
            <FooterColumn title="Account" links={footerLinks.account} />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl border border-border bg-background p-6 sm:flex-row sm:justify-between sm:p-8">
          <div>
            <h3 className="font-heading text-lg font-medium">
              Fresh listings every week
            </h3>
            <p className="text-sm text-muted-foreground">
              Get our weekly drop of new livestock and farm essentials.
            </p>
          </div>
          <NewsletterForm compact />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/faq" className="transition-colors hover:text-foreground">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: ReadonlyArray<{ title: string; href: string }>
}) {
  return (
    <nav aria-label={title}>
      <h4 className="mb-4 text-sm font-semibold text-foreground">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-brand"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { SiteFooter }
