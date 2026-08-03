import type { Metadata } from "next"
import { HeartHandshakeIcon, ShieldCheckIcon, LeafIcon, UsersIcon } from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { CountUp } from "@/components/shared/count-up"
import { Reveal } from "@/components/shared/reveal"
import { gallery } from "@/mock/gallery"

export const metadata: Metadata = {
  title: "About us",
  description:
    "Pasture & Co. is the modern livestock marketplace connecting verified farms with farmers who care — with health-certified animals and delivery you can trust.",
  alternates: { canonical: "/about" },
}

const stats = [
  { value: 1280, suffix: "+", label: "Verified sellers" },
  { value: 24, suffix: "k", label: "Animals delivered" },
  { value: 96, suffix: "%", label: "Happy buyers" },
  { value: 40, suffix: "", label: "States served" },
]

const values = [
  {
    icon: ShieldCheckIcon,
    title: "Health first",
    description:
      "Every animal is vet-checked and listed with complete vaccination and treatment records. No hidden conditions, ever.",
  },
  {
    icon: HeartHandshakeIcon,
    title: "Fair to both sides",
    description:
      "Farmers keep 96% of every sale. Buyers get transparent listings and a 7-day health guarantee on every animal.",
  },
  {
    icon: LeafIcon,
    title: "Kinder transport",
    description:
      "We partner with licensed hauliers using biosecure, low-stress crates — and offset the carbon of every delivery.",
  },
  {
    icon: UsersIcon,
    title: "Community grown",
    description:
      "Built with input from hundreds of smallholder, hobby and commercial farmers to solve the problems they actually face.",
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="The modern way to move livestock"
        description="Pasture & Co. exists to make buying and selling animals as reassuring as trading with a trusted neighbour — but at the scale of the internet."
        crumbs={[{ label: "About" }]}
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-lift">
              <img src={gallery.pasture} alt="Pasture and livestock" className="aspect-[4/3] w-full object-cover" />
            </div>
          </Reveal>
          <div className="flex flex-col gap-5">
            <Reveal delay={0.05}>
              <h2 className="font-heading text-3xl font-medium tracking-tight">
                Born from a frustrating problem
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Selling a heifer or a flock used to mean endless phone calls,
                  dodgy classified listings and hauliers who vanished without
                  warning. Buying meant trusting a stranger over a pixelated
                  photo.
                </p>
                <p>
                  We built Pasture & Co. to fix that. Every farm is
                  location-verified, every listing carries its health paperwork,
                  and every delivery is coordinated by licensed, biosecure
                  hauliers.
                </p>
                <p>
                  The result is a marketplace tens of thousands of farmers rely
                  on — whether they&apos;re buying their first pullets or
                  selling registered breeding stock.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 sm:px-8 lg:grid-cols-4 lg:px-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
              <p className="font-heading text-4xl font-semibold tracking-tight tabular-nums">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-heading text-3xl font-medium tracking-tight">
            What we stand for
          </h2>
          <p className="mt-2 text-muted-foreground">
            Four principles guide every feature we ship and every farm we approve.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-lift"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <value.icon className="size-5" strokeWidth={1.75} />
              </span>
              <div className="space-y-1.5">
                <h3 className="font-heading text-lg font-medium">{value.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
