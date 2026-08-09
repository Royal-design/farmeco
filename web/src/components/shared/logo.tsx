import Image from "next/image"
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
        "inline-flex size-8 items-center justify-center overflow-hidden rounded-xl shadow-sm",
        className
      )}
    >
      <Image
        src="/farmeco.webp"
        alt=""
        aria-hidden="true"
        width={1024}
        height={1024}
        className="size-full object-cover"
        draggable={false}
      />
    </span>
  )
}

function Logo({ className, href = "/", showWordmark = true }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Farmeco home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <LogoMark />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Farm<span className="text-brand">eco</span>
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
