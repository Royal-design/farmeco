"use client"

import { motion } from "framer-motion"
import { ArrowUpRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import type { Category } from "@/types/catalog"
import { formatNumber } from "@/utils/format"

interface CategoryCardProps {
  category: Category
  className?: string
  compact?: boolean
}

function CategoryCard({
  category,
  className,
  compact = false,
}: CategoryCardProps) {
  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      className={cn("h-full", className)}
    >
      <Link
        href={`/shop?category=${category.slug}`}
        className={cn(
          "group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card",
          "transition-all duration-300 hover:border-brand/30 hover:shadow-lift",
          compact
            ? "aspect-[1.35/1] sm:aspect-[4/3]"
            : "aspect-[1.25/1] sm:aspect-[3/4]"
        )}
      >
        {/* Image */}
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
            loading="lazy"
            className={cn(
              "object-cover",
              "transition-transform duration-700 ease-out",
              "group-hover:scale-[1.06]"
            )}
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/5" />

        {/* Content */}
        <motion.div
          variants={{
            rest: { y: 0 },
            hover: { y: -3 },
          }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={cn(
            "relative z-10 flex flex-col",
            "gap-1",
            "p-3 sm:gap-1.5 sm:p-5"
          )}
        >
          {/* Category name + arrow */}
          <div className="flex items-center justify-between gap-3">
            <h3
              className={cn(
                "min-w-0 truncate font-heading font-semibold leading-tight text-white",
                "text-sm sm:text-lg md:text-xl"
              )}
            >
              {category.name}
            </h3>

            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full",
                "border border-white/20 bg-white/10 backdrop-blur-sm",
                "transition-all duration-300",
                "group-hover:border-white/40 group-hover:bg-white/20"
              )}
            >
              <ArrowUpRightIcon
                className={cn(
                  "size-3.5 text-white",
                  "transition-transform duration-300",
                  "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                )}
              />
            </span>
          </div>

          {/* Description */}
          <p className="line-clamp-1 text-[11px] leading-relaxed text-white/70 sm:line-clamp-2 sm:text-sm">
            {category.shortDescription}
          </p>

          {/* Listings */}
          <div className="mt-1 flex items-center">
            <span className="text-[10px] font-medium uppercase tracking-wide text-white/60 sm:text-xs">
              {formatNumber(category.productCount)} listings
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export { CategoryCard }
