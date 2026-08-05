"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ShieldCheckIcon, TruckIcon, BadgeCheckIcon } from "lucide-react"

import { Logo } from "@/components/shared/logo"
import { GradientOrb } from "@/components/shared/gradient-orb"
import { gallery } from "@/mock/gallery"

interface AuthShellProps {
  children: React.ReactNode
}

const perks = [
  { icon: ShieldCheckIcon, text: "Every animal vet-checked before listing" },
  { icon: TruckIcon, text: "Licensed, biosecure delivery to your gate" },
  { icon: BadgeCheckIcon, text: "Verified farms with full health paperwork" },
]

function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src={gallery.hero}
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand/90 via-brand/70 to-night/90" />
        <GradientOrb variant="honey" className="top-20 right-10 opacity-40" />
        <GradientOrb variant="brand" className="bottom-10 left-10 opacity-50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <Logo showWordmark />
          </div>
          <div className="space-y-6">
            <h2 className="font-heading text-4xl font-medium leading-tight text-balance text-white">
              Welcome to the modern livestock marketplace.
            </h2>
            <ul className="space-y-3">
              {perks.map((perk) => (
                <li key={perk.text} className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                    <perk.icon className="size-4" />
                  </span>
                  {perk.text}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/60">
            Join 24,000+ farmers using Pasture & Co.
          </p>
        </div>
      </div>

      <div className="relative flex flex-col items-center overflow-hidden bg-background px-5 py-10 sm:px-8">
        <GradientOrb variant="brand" className="-top-24 right-0 opacity-30" />
        <div className="relative w-full max-w-md flex-1 flex flex-col">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Logo />
            <Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Back to shop
            </Link>
          </div>
          <div className="flex flex-1 flex-col justify-center py-6">{children}</div>
          <p className="text-center text-xs text-muted-foreground">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
              Terms
            </Link>{" "}
            &{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export { AuthShell }
