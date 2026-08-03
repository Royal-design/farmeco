"use client"

import * as React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { StarIcon } from "lucide-react"
import { toast } from "sonner"

import { reviewSchema, type ReviewFormValues } from "@/schemas/review.schema"
import { reviewsService } from "@/services/reviews.service"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/store/auth-store"

interface ReviewFormProps {
  productId: string
  productName: string
}

function StarPicker({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const [hover, setHover] = React.useState(0)
  const active = hover || value
  return (
    <div
      className="flex gap-1"
      role="radiogroup"
      aria-label="Your rating"
      aria-required="true"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <StarIcon
            className={cn(
              "size-7 transition-all",
              star <= active ? "fill-honey text-honey" : "fill-foreground/10 text-foreground/10"
            )}
          />
        </button>
      ))}
    </div>
  )
}

function ReviewForm({ productId, productName }: ReviewFormProps) {
  const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: "", comment: "" },
    mode: "onTouched",
  })

  const mutation = useMutation({
    mutationFn: reviewsService.submitReview,
    onSuccess: () => {
      toast.success("Review submitted", {
        description: "Thanks for helping other farmers!",
      })
      form.reset()
      queryClient.invalidateQueries({ queryKey: ["product"] })
    },
    onError: () => {
      toast.error("Couldn't submit review", {
        description: "Please try again in a moment.",
      })
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate({
      productId,
      author: user?.name ?? "Verified buyer",
      rating: values.rating,
      title: values.title,
      comment: values.comment,
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field>
        <FieldLabel>Your rating</FieldLabel>
        <Controller
          name="rating"
          control={form.control}
          render={({ field }) => <StarPicker value={field.value} onChange={field.onChange} />}
        />
        <FieldError errors={[form.formState.errors.rating]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="review-title">Review title</FieldLabel>
        <Controller
          name="title"
          control={form.control}
          render={({ field }) => (
            <Input
              id="review-title"
              placeholder={`Summary of your ${productName} experience`}
              aria-invalid={!!form.formState.errors.title}
              {...field}
            />
          )}
        />
        <FieldError errors={[form.formState.errors.title]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="review-comment">Your review</FieldLabel>
        <FieldDescription>
          Share details about health, temperament and the seller&apos;s service.
        </FieldDescription>
        <Controller
          name="comment"
          control={form.control}
          render={({ field }) => (
            <Textarea
              id="review-comment"
              placeholder="How was your experience?"
              rows={4}
              aria-invalid={!!form.formState.errors.comment}
              {...field}
            />
          )}
        />
        <FieldError errors={[form.formState.errors.comment]} />
      </Field>

      <div className="mt-1">
        <Button type="submit" disabled={mutation.isPending || form.formState.isSubmitting}>
          {mutation.isPending ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Submitting…
            </>
          ) : (
            "Submit review"
          )}
        </Button>
      </div>
    </form>
  )
}

export { ReviewForm }
