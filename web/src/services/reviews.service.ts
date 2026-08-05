import type { ProductReview } from "@/types/catalog"
import { api } from "@/lib/http"
import { mapReview, type RawReview } from "@/services/mappers"

export interface SubmitReviewInput {
  productId: string
  author?: string
  rating: number
  title: string
  comment: string
}

export const reviewsService = {
  async submitReview(input: SubmitReviewInput): Promise<ProductReview> {
    const { data } = await api.post<RawReview>("/reviews", {
      product_id: input.productId,
      rating: input.rating,
      title: input.title,
      comment: input.comment,
    })
    return mapReview(data)
  },

  async reportHelpful(reviewId: string): Promise<void> {
    await api.post(`/reviews/${reviewId}/helpful`)
  },

  async getProductReviews(productId: string): Promise<ProductReview[]> {
    const { data } = await api.get<RawReview[]>(`/reviews/product/${productId}`, {
      page_size: 50,
    })
    return data.map(mapReview)
  },

  async deleteReview(reviewId: string): Promise<void> {
    await api.delete(`/reviews/${reviewId}`)
  },
}
