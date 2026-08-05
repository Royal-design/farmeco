"use client"

import * as React from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"

import { cn } from "@/lib/utils"

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  x?: number
  blur?: boolean
  once?: boolean
  as?: "div" | "section" | "span" | "li" | "article"
}

function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  x = 0,
  blur = true,
  once = true,
  as = "div",
}: RevealProps) {
  const prefersReduced = useReducedMotion()
  const Component = motion[as]

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: prefersReduced ? 0 : y,
      x: prefersReduced ? 0 : x,
      filter: blur && !prefersReduced ? "blur(6px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <Component
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.05 }}
    >
      {children}
    </Component>
  )
}

interface StaggerProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
  as?: "div" | "ul" | "section"
  animateOnMount?: boolean
}

function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = "div",
  animateOnMount = false,
}: StaggerProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial="hidden"
      {...(animateOnMount
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, amount: 0.05 } })}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </Component>
  )
}

function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 22, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export { Reveal, Stagger, StaggerItem }
