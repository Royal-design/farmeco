"use client"

import * as React from "react"
import { ArrowRightIcon } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button, ButtonLink, type buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"

interface AnimatedButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button>,
    VariantProps<typeof buttonVariants> {
  href?: string
  showArrow?: boolean
}

function AnimatedButton({
  className,
  children,
  href,
  showArrow = true,
  variant,
  size,
  ...props
}: AnimatedButtonProps) {
  const content = (
    <>
      <span className="inline-flex items-center gap-1.5 transition-transform duration-300 group-hover:-translate-x-0.5">
        {children}
      </span>
      {showArrow && (
        <motion.span
          className="inline-flex"
          initial={{ x: 0, opacity: 0.7 }}
          whileHover={{ x: 3, opacity: 1 }}
        >
          <ArrowRightIcon className="size-4" />
        </motion.span>
      )}
    </>
  )

  const classes = cn("group", className)

  if (href) {
    return (
      <ButtonLink href={href} variant={variant} size={size} className={classes}>
        {content}
      </ButtonLink>
    )
  }

  return (
    <Button {...props} className={classes}>
      {content}
    </Button>
  )
}

export { AnimatedButton }
