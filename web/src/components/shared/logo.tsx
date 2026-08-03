import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  href?: string
  showWordmark?: boolean
}

function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-moss text-white shadow-sm ring-1 ring-brand/20",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-4.5"
        aria-hidden="true"
      >
        <path
          d="M12 3c.3 3.4 2 6.6 5 8.5-.9 4-4.2 6.8-8.2 6.8A6 6 0 0 1 12 3Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M12 11c-.5 3.2-2.4 6-5 7.5-.3-3.6 1.7-6.6 5-7.5Z"
          fill="currentColor"
          opacity="0.55"
        />
        <circle cx="12" cy="7.2" r="1.6" fill="currentColor" opacity="0.4" />
      </svg>
    </span>
  )
}

function Logo({ className, href = "/", showWordmark = true }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Pasture & Co. home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <LogoMark />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Pasture
            <span className="text-honey-foreground">&amp; Co.</span>
          </span>
          <span className="text-[0.6rem] font-medium tracking-[0.22em] text-muted-foreground uppercase">
            Livestock marketplace
          </span>
        </span>
      )}
    </Link>
  )
}

export { Logo, LogoMark }
