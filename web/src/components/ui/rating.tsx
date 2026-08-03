import { StarIcon, StarHalfIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface RatingProps {
  value: number
  size?: "sm" | "md" | "lg"
  className?: string
  showValue?: boolean
  count?: number
}

const sizes = {
  sm: "size-3",
  md: "size-4",
  lg: "size-5",
} as const

function Rating({ value, size = "md", className, showValue, count }: RatingProps) {
  const rounded = Math.round(value * 2) / 2

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span
        className="inline-flex items-center gap-0.5"
        role="img"
        aria-label={`Rated ${value} out of 5`}
      >
        {Array.from({ length: 5 }, (_, index) => {
          const position = index + 1
          if (rounded >= position) {
            return (
              <StarIcon
                key={position}
                className={cn(sizes[size], "fill-honey text-honey")}
              />
            )
          }
          if (rounded === position - 0.5) {
            return (
              <span key={position} className="relative inline-flex">
                <StarIcon
                  className={cn(sizes[size], "text-foreground/20 fill-foreground/20")}
                />
                <StarHalfIcon
                  className={cn(
                    sizes[size],
                    "absolute inset-0 fill-honey text-honey"
                  )}
                />
              </span>
            )
          }
          return (
            <StarIcon
              key={position}
              className={cn(sizes[size], "text-foreground/20 fill-foreground/20")}
            />
          )
        })}
      </span>
      {showValue && (
        <span className="text-sm font-medium text-foreground">
          {value.toFixed(1)}
        </span>
      )}
      {typeof count === "number" && (
        <span className="text-sm text-muted-foreground">({count})</span>
      )}
    </span>
  )
}

export { Rating }
