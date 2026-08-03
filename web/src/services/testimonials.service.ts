import type { Testimonial } from "@/types/catalog"
import { testimonials } from "@/mock/testimonials"
import { mockRequest } from "@/services/request"

export const testimonialsService = {
  async getTestimonials(): Promise<Testimonial[]> {
    return mockRequest(testimonials, 250)
  },
}
