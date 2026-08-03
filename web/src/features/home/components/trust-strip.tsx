"use client"

import {
  ShieldCheckIcon,
  TruckIcon,
  LeafIcon,
  BadgeCheckIcon,
  RefreshCcwIcon,
  CreditCardIcon,
} from "lucide-react"

import { Marquee } from "@/components/shared/marquee"

const items = [
  { icon: ShieldCheckIcon, label: "Every animal vet-checked" },
  { icon: BadgeCheckIcon, label: "Verified farm locations" },
  { icon: TruckIcon, label: "Free delivery over $200" },
  { icon: RefreshCcwIcon, label: "7-day health guarantee" },
  { icon: LeafIcon, label: "Carbon-conscious transport" },
  { icon: CreditCardIcon, label: "Secure payments" },
]

function TrustStrip() {
  return (
    <section className="border-y border-border bg-muted/40 py-5">
      <Marquee speed={32}>
        {items.map((item) => (
          <span
            key={item.label}
            className="mx-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"
          >
            <item.icon className="size-4 text-brand" />
            {item.label}
          </span>
        ))}
      </Marquee>
    </section>
  )
}

export { TrustStrip }
