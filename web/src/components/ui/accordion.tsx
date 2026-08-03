"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

function Accordion({ items, className }: AccordionProps) {
  const [open, setOpen] = React.useState<number | null>(0)

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, index) => {
        const isOpen = open === index
        return (
          <div
            key={item.question}
            className={cn(
              "overflow-hidden rounded-2xl border transition-colors",
              isOpen ? "border-brand/25 bg-card shadow-soft" : "border-border bg-card"
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <span className="font-medium">{item.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                  isOpen
                    ? "border-brand/30 bg-brand/10 text-brand"
                    : "border-border text-muted-foreground"
                )}
              >
                <PlusIcon className="size-3.5" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export { Accordion }
