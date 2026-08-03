import * as React from "react"

import { cn } from "@/lib/utils"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { GradientOrb } from "@/components/shared/gradient-orb"
import { Reveal } from "@/components/shared/reveal"

interface PageHeaderProps {
  eyebrow?: string
  title: React.ReactNode
  description?: string
  crumbs?: Array<{ label: string; href?: string }>
  className?: string
  children?: React.ReactNode
}

function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  className,
  children,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b bg-gradient-to-b from-brand/[0.06] via-background to-background",
        className
      )}
    >
      <GradientOrb
        variant="brand"
        className="-top-24 left-1/2 -translate-x-1/2 opacity-60"
      />
      <GradientOrb
        variant="honey"
        size="sm"
        className="-top-10 right-[12%] opacity-40"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-5 px-5 pt-14 pb-12 sm:px-8 lg:px-10 lg:pt-16 lg:pb-16">
        {crumbs && (
          <Reveal delay={0} y={10}>
            <Breadcrumb items={crumbs} />
          </Reveal>
        )}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <Reveal delay={0.05}>
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-semibold tracking-wide text-brand uppercase">
                  <span className="size-1.5 rounded-full bg-honey" />
                  {eyebrow}
                </span>
              </Reveal>
            )}
            <Reveal delay={0.1}>
              <h1 className="font-heading text-4xl font-medium tracking-tight text-balance sm:text-5xl">
                {title}
              </h1>
            </Reveal>
            {description && (
              <Reveal delay={0.15}>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </Reveal>
            )}
          </div>
          {children && (
            <Reveal delay={0.2} className="shrink-0">
              {children}
            </Reveal>
          )}
        </div>
      </div>
    </header>
  )
}

export { PageHeader }
