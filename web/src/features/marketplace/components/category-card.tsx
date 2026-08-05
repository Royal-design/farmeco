"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRightIcon } from "lucide-react"
import { motion } from "framer-motion"

import type { Category } from "@/types/catalog"
import { cn } from "@/lib/utils"
import { formatNumber } from "@/utils/format"

interface CategoryCardProps {
  category: Category
  className?: string
  compact?: boolean
}

function CategoryCard({ category, className, compact = false }: CategoryCardProps) {
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
          "group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-brand/25 hover:shadow-lift",
          compact ? "aspect-[4/3]" : "aspect-[4/5] sm:aspect-[3/4]"
        )}
      >
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
            loading="lazy"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

        <motion.div
          variants={{
            rest: { y: 0 },
            hover: { y: -4 },
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col gap-1.5 p-5"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{category.emoji}</span>
            <h3 className="font-heading text-xl font-medium text-white">
              {category.name}
            </h3>
          </div>
          <p className="line-clamp-2 text-sm text-white/70">
            {category.shortDescription}
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white/85">
            {formatNumber(category.productCount)} listings
            <ArrowUpRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export { CategoryCard }
