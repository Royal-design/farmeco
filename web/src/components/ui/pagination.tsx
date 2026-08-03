"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  siblingCount?: number
}

function getPageItems(current: number, total: number, siblings = 1) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: Array<number | "ellipsis-start" | "ellipsis-end"> = []
  const leftBound = Math.max(2, current - siblings)
  const rightBound = Math.min(total - 1, current + siblings)

  pages.push(1)
  if (leftBound > 2) {
    pages.push("ellipsis-start")
  }
  for (let i = leftBound; i <= rightBound; i += 1) {
    pages.push(i)
  }
  if (rightBound < total - 1) {
    pages.push("ellipsis-end")
  }
  pages.push(total)
  return pages
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
}: PaginationProps) {
  const items = getPageItems(page, totalPages, siblingCount)

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </Button>

      {items.map((item, index) => {
        if (item === "ellipsis-start" || item === "ellipsis-end") {
          return (
            <span
              key={item}
              className="flex h-7 w-7 items-center justify-center text-sm text-muted-foreground"
            >
              …
            </span>
          )
        }
        return (
          <Button
            key={item}
            variant={item === page ? "default" : "outline"}
            size="icon-sm"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={cn(
              item === page &&
                "bg-brand text-brand-foreground hover:bg-brand/90"
            )}
          >
            {item}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </Button>
    </nav>
  )
}

export { Pagination }
