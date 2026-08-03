"use client"

import * as React from "react"
import { ThumbsUpIcon } from "lucide-react"
import { toast } from "sonner"

import type { ProductReview } from "@/types/catalog"
import { formatDate } from "@/utils/format"
import { Avatar } from "@/components/ui/avatar"
import { Rating } from "@/components/ui/rating"

interface ReviewListProps {
  reviews: ProductReview[]
}

function ReviewList({ reviews }: ReviewListProps) {
  const [helpful, setHelpful] = React.useState<Record<string, boolean>>({})

  if (reviews.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        No reviews yet — be the first to share your experience.
      </p>
    )
  }

  const handleHelpful = (id: string) => {
    if (helpful[id]) return
    setHelpful((state) => ({ ...state, [id]: true }))
    toast.success("Thanks for the feedback!")
  }

  return (
    <ul className="flex flex-col gap-5">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar name={review.author} size="sm" />
              <div>
                <p className="text-sm font-medium">{review.author}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(review.date)}
                </p>
              </div>
            </div>
            <Rating value={review.rating} size="sm" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold">{review.title}</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {review.comment}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleHelpful(review.id)}
            disabled={helpful[review.id]}
            className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-brand/30 hover:text-brand disabled:opacity-60"
          >
            <ThumbsUpIcon className="size-3.5" />
            {helpful[review.id] ? "Thanks!" : "Helpful"}
            <span className="text-muted-foreground">({review.helpfulCount + (helpful[review.id] ? 1 : 0)})</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export { ReviewList }
