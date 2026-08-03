import type { ProductReview } from "@/types/catalog"
import { mockRequest } from "@/services/request"

export interface SubmitReviewInput {
  productId: string
  author: string
  rating: number
  title: string
  comment: string
}

export const reviewsService = {
  async submitReview(input: SubmitReviewInput): Promise<ProductReview> {
    const review: ProductReview = {
      id: `r-${Date.now()}`,
      author: input.author,
      authorInitials: input.author
        .split(/\s+/)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join(""),
      rating: input.rating,
      title: input.title,
      comment: input.comment,
      date: new Date().toISOString().slice(0, 10),
      helpfulCount: 0,
    }
    return mockRequest(review, 600)
  },

  async reportHelpful(reviewId: string): Promise<void> {
    await mockRequest(undefined, 250)
  },
}
