"use client"

import * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  max?: number
  min?: number
  size?: "sm" | "md"
  className?: string
}

function QuantityStepper({
  value,
  onChange,
  max = 99,
  min = 1,
  size = "md",
  className,
}: QuantityStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1))
  const increment = () => onChange(Math.min(max, value + 1))

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-background",
        size === "sm" ? "h-7" : "h-9",
        className
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "inline-flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40",
          size === "sm" ? "size-7" : "size-9"
        )}
      >
        <MinusIcon className={size === "sm" ? "size-3" : "size-3.5"} />
      </button>
      <span
        aria-live="polite"
        className={cn(
          "text-center font-medium tabular-nums",
          size === "sm" ? "w-6 text-sm" : "w-8"
        )}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          "inline-flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40",
          size === "sm" ? "size-7" : "size-9"
        )}
      >
        <PlusIcon className={size === "sm" ? "size-3" : "size-3.5"} />
      </button>
    </div>
  )
}

export { QuantityStepper }
