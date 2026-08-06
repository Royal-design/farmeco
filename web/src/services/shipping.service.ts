import type { ShippingSettings } from "@/types/shipping"
import { api } from "@/lib/http"

interface RawShippingSettings {
  id: string
  free_shipping_threshold: number | string
  flat_rate: number | string
  updated_at: string
}

function mapSettings(raw: RawShippingSettings): ShippingSettings {
  return {
    freeShippingThreshold: Number(raw.free_shipping_threshold),
    flatRate: Number(raw.flat_rate),
    updatedAt: raw.updated_at,
  }
}

export interface ShippingSettingsInput {
  freeShippingThreshold: number
  flatRate: number
}

export const shippingService = {
  async getSettings(): Promise<ShippingSettings> {
    const { data } = await api.get<RawShippingSettings>("/settings/shipping")
    return mapSettings(data)
  },

  async updateSettings(input: ShippingSettingsInput): Promise<ShippingSettings> {
    const { data } = await api.put<RawShippingSettings>("/settings/shipping", {
      free_shipping_threshold: input.freeShippingThreshold,
      flat_rate: input.flatRate,
    })
    return mapSettings(data)
  },
}
