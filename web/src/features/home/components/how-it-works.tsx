"use client"

import { SearchCheckIcon, ClipboardCheckIcon, TruckIcon, LeafIcon } from "lucide-react"

import { SectionHeading } from "@/components/shared/section-heading"
import { Stagger, StaggerItem } from "@/components/shared/reveal"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: SearchCheckIcon,
    step: "01",
    title: "Browse verified listings",
    description:
      "Filter by species, breed, health records and location. Every farm is location-verified before they can sell.",
  },
  {
    icon: ClipboardCheckIcon,
    step: "02",
    title: "Review health paperwork",
    description:
      "Vaccination logs, vet reports and DNA results travel with every listing — nothing hidden, nothing vague.",
  },
  {
    icon: TruckIcon,
    step: "03",
    title: "Delivery to your gate",
    description:
      "Licensed hauliers with biosecure crates bring your animals within a delivery window you pick.",
  },
  {
    icon: LeafIcon,
    step: "04",
    title: "Settle in with support",
    description:
      "Every order includes a 7-day health guarantee and direct access to the seller for advice.",
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <SectionHeading
        align="center"
        eyebrow="How it works"
        title="From listing to pasture in four steps"
        description="We made buying livestock online as reassuring as buying from a neighbour."
        className="mb-12"
      />

      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <StaggerItem key={step.step}>
            <div className="group relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-lift">
              <span className="pointer-events-none absolute top-4 right-5 font-heading text-4xl font-semibold text-foreground/8 transition-colors group-hover:text-brand/15">
                {step.step}
              </span>
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                <step.icon className="size-5" strokeWidth={1.75} />
              </span>
              <div className={cn("space-y-1.5")}>
                <h3 className="font-heading text-lg font-medium">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

export { HowItWorks }
