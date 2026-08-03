import * as React from "react"

import { cn } from "@/lib/utils"

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  reverse?: boolean
  speed?: number
  mask?: boolean
}

function Marquee({
  children,
  className,
  reverse = false,
  speed = 36,
  mask = true,
}: MarqueeProps) {
  return (
    <div
      className={cn("flex overflow-hidden", mask && "mask-fade-x", className)}
    >
      <div
        className="flex shrink-0 animate-marquee items-center"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  )
}

export { Marquee }
