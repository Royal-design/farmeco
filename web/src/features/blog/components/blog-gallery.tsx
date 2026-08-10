"use client"

import * as React from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface BlogGalleryProps {
  images: string[]
  title: string
}

function BlogGallery({ images, title }: BlogGalleryProps) {
  const [active, setActive] = React.useState(0)

  return (
    <figure className="mb-10">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-muted shadow-lift">
        <div className="relative aspect-[16/8]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={`${title} — image ${active + 1}`}
                fill
                priority={active === 0}
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <span className="absolute right-4 bottom-4 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
              {active + 1} / {images.length}
            </span>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <figcaption className="mt-3 flex gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={active === index}
              className={cn(
                "relative aspect-[16/8] w-28 shrink-0 overflow-hidden rounded-xl border transition-all",
                active === index
                  ? "border-brand ring-2 ring-brand/20"
                  : "border-border opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </figcaption>
      )}
    </figure>
  )
}

export { BlogGallery }
