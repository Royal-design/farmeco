import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { CountUp } from "@/components/shared/count-up"

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  hint?: string
  accent?: "brand" | "honey" | "moss" | "clay"
  className?: string
}

const accents = {
  brand: "bg-brand/10 text-brand",
  honey: "bg-honey/15 text-honey-foreground",
  moss: "bg-moss/10 text-moss",
  clay: "bg-clay/10 text-clay",
} as const

function StatsCard({
  icon: Icon,
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  hint,
  accent = "brand",
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-brand/25 hover:shadow-lift",
        className
      )}
    >
      <span className={cn("flex size-10 items-center justify-center rounded-xl", accents[accent])}>
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums">
          <CountUp to={value} prefix={prefix} suffix={suffix} decimals={decimals} />
        </p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      {hint && <p className="text-xs text-muted-foreground/80">{hint}</p>}
    </div>
  )
}

export { StatsCard }
