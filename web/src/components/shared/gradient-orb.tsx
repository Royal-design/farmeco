import { cn } from "@/lib/utils"

interface GradientOrbProps {
  className?: string
  variant?: "brand" | "honey" | "clay" | "moss"
  size?: "sm" | "md" | "lg"
}

const variants = {
  brand: "from-brand/35 via-moss/25 to-transparent",
  honey: "from-honey/35 via-clay/20 to-transparent",
  clay: "from-clay/30 via-honey/15 to-transparent",
  moss: "from-moss/30 via-brand/15 to-transparent",
} as const

const sizes = {
  sm: "size-40 blur-3xl",
  md: "size-72 blur-3xl",
  lg: "size-96 blur-3xl",
} as const

function GradientOrb({
  className,
  variant = "brand",
  size = "md",
}: GradientOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full bg-gradient-to-br",
        variants[variant],
        sizes[size],
        className
      )}
    />
  )
}

export { GradientOrb }
