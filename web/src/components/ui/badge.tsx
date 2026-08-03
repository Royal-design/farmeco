import type { ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset transition-colors [&>svg]:size-3 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-foreground/5 text-foreground ring-foreground/10",
        neutral: "bg-muted text-foreground ring-foreground/10",
        brand: "bg-brand/10 text-brand ring-brand/20 dark:bg-brand/15",
        honey: "bg-honey/15 text-honey-foreground ring-honey/30 dark:text-honey",
        moss: "bg-moss/10 text-moss ring-moss/20",
        clay: "bg-clay/10 text-clay ring-clay/25",
        outline: "bg-transparent text-foreground ring-foreground/15",
        success: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:text-emerald-400",
        warning: "bg-amber-500/10 text-amber-600 ring-amber-500/30 dark:text-amber-400",
        info: "bg-sky-500/10 text-sky-600 ring-sky-500/25 dark:text-sky-400",
        danger: "bg-destructive/10 text-destructive ring-destructive/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

function BadgeIcon({ children }: { children: ReactNode }) {
  return <span className="flex items-center">{children}</span>
}

export { Badge, BadgeIcon, badgeVariants }
