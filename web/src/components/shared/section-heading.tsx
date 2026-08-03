import * as React from "react"

import { cn } from "@/lib/utils"
import { Reveal } from "@/components/shared/reveal"

interface SectionHeadingProps {
  eyebrow?: string
  title: React.ReactNode
  description?: string
  align?: "left" | "center"
  className?: string
  as?: "h1" | "h2" | "h3"
  action?: React.ReactNode
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div className={cn("flex flex-col gap-3", align === "center" && "items-center")}>
        {eyebrow && (
          <Reveal delay={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-semibold tracking-wide text-brand uppercase">
              <span className="size-1.5 rounded-full bg-honey" />
              {eyebrow}
            </span>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <Heading
            className={cn(
              "font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl",
              align === "center" && "text-pretty"
            )}
          >
            {title}
          </Heading>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p
              className={cn(
                "max-w-2xl text-base leading-relaxed text-muted-foreground",
                align === "center" && "mx-auto"
              )}
            >
              {description}
            </p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal delay={0.15} className={cn("shrink-0", align === "center" && "mt-1")}>
          {action}
        </Reveal>
      )}
    </div>
  )
}

export { SectionHeading }
