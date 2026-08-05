import { formatPrice } from "@/utils/format"
import { cn } from "@/lib/utils"

interface PriceProps {
  value: number
  compareAt?: number
  currency?: string
  unit?: string
  className?: string
  size?: "sm" | "md" | "lg"
  showOriginal?: boolean
}

const sizes = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
} as const

function Price({
  value,
  compareAt,
  currency = "NGN",
  unit,
  className,
  size = "md",
  showOriginal = true,
}: PriceProps) {
  const hasDiscount = typeof compareAt === "number" && compareAt > value

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-1.5", className)}>
      <span
        className={cn(
          "font-medium tracking-tight tabular-nums",
          sizes[size],
          hasDiscount && "text-foreground"
        )}
      >
        {formatPrice(value, currency)}
      </span>
      {showOriginal && hasDiscount && (
        <span
          className={cn(
            "text-muted-foreground line-through tabular-nums",
            size === "lg" ? "text-base" : "text-xs"
          )}
        >
          {formatPrice(compareAt, currency)}
        </span>
      )}
      {unit && (
        <span className="text-xs font-normal text-muted-foreground">/ {unit}</span>
      )}
    </span>
  )
}

export { Price }
