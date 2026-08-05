"use client"

import * as React from "react"
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { motion } from "framer-motion"

import { gallery } from "@/mock/gallery"
import { AnimatedButton } from "@/components/shared/animated-button"
import { GradientOrb } from "@/components/shared/gradient-orb"
import { CountUp } from "@/components/shared/count-up"
import { Rating } from "@/components/ui/rating"

const stats = [
  { value: 1280, suffix: "+", label: "Verified sellers" },
  { value: 24, suffix: "k", label: "Animals delivered" },
  { value: 4.9, suffix: "★", label: "Average rating", decimals: 1 },
]

const floatingBadges = [
  {
    icon: ShieldCheckIcon,
    title: "Health certified",
    subtitle: "Vet-checked listings",
    className: "-left-4 top-16 sm:-left-10",
    delay: 0.2,
  },
  {
    icon: TruckIcon,
    title: "Free delivery",
    subtitle: "Orders over ₦200,000",
    className: "-right-3 top-1/3 sm:-right-8",
    delay: 0.35,
  },
  {
    icon: BadgeCheckIcon,
    title: "Verified farms",
    subtitle: "Location confirmed",
    className: "bottom-8 -left-2 sm:bottom-12 sm:-left-6",
    delay: 0.5,
  },
]

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-soft mask-fade-b" aria-hidden="true" />
      <GradientOrb variant="brand" className="-top-32 -left-24 opacity-70" />
      <GradientOrb variant="honey" className="top-1/4 -right-32 opacity-50" />
      <GradientOrb variant="clay" size="sm" className="bottom-0 left-1/3 opacity-30" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pt-16 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-10 lg:pt-24 lg:pb-28">
        <div className="flex flex-col gap-7">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/15 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-moss opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-moss" />
            </span>
            Spring herd drop · New arrivals this week
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-heading text-5xl font-medium leading-[1.04] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Healthy livestock,
            <br />
            from trusted farms{" "}
            <span className="text-gradient-brand italic">to your gate.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Discover health-certified cattle, goats, poultry and farm essentials
            from verified local farms — with transparent records, fair prices
            and delivery that arrives alive and thriving.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="flex flex-wrap items-center gap-3"
          >
            <AnimatedButton href="/shop" size="lg" className="rounded-full px-6">
              Browse marketplace
            </AnimatedButton>
            <AnimatedButton
              href="#how-it-works"
              variant="ghost"
              size="lg"
              className="rounded-full px-5"
              showArrow={false}
            >
              How it works
            </AnimatedButton>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-2 flex flex-wrap gap-10"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <dt className="order-2 text-xs font-medium text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="order-1 font-heading text-3xl font-semibold tracking-tight tabular-nums">
                  <CountUp to={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <div className="relative aspect-[4/4.4] overflow-hidden rounded-[2rem] border border-white/20 shadow-lift">
            <img
              src={gallery.hero}
              alt="Pasture and livestock"
              className="size-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <Rating value={4.9} showValue />
                <p className="mt-1 text-sm font-medium text-white">
                  Loved by 24,000+ farmers
                </p>
              </div>
              <AnimatedButton
                href="/shop"
                size="sm"
                className="rounded-full bg-white/90 text-foreground backdrop-blur hover:bg-white"
              >
                Shop now
              </AnimatedButton>
            </div>
          </div>

          {floatingBadges.map((badge) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: badge.delay }}
              className="absolute hidden sm:block"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: badge.delay,
                }}
                className={badge.className}
              >
                <div className="glass flex items-center gap-3 rounded-2xl border border-white/20 p-3 shadow-lift">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-white">
                    <badge.icon className="size-4.5" />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-foreground">
                      {badge.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {badge.subtitle}
                    </span>
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export { Hero }
