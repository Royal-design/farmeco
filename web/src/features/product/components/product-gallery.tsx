"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  name: string
}

function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = React.useState(0)

  const previous = () => setActive((index) => (index - 1 + images.length) % images.length)
  const next = () => setActive((index) => (index + 1) % images.length)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-muted">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={`${name} — view ${active + 1}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="size-full object-cover"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute top-1/2 right-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </>
        )}
      </div>

      <div className="flex gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`View image ${index + 1}`}
            aria-current={active === index}
            className={cn(
              "relative aspect-square w-20 overflow-hidden rounded-xl border transition-all",
              active === index
                ? "border-brand ring-2 ring-brand/20"
                : "border-border opacity-70 hover:opacity-100"
            )}
          >
            <img src={image} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

export { ProductGallery }
