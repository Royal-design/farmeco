import { gallery } from "@/mock/gallery"
import { mockRequest } from "@/services/request"

export const galleryService = {
  async getHeroImages(): Promise<Record<string, string>> {
    return mockRequest({ ...gallery }, 100)
  },

  async getGallery(): Promise<string[]> {
    return mockRequest(Object.values(gallery), 120)
  },
}
