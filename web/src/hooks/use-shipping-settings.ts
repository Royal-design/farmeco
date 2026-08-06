"use client"

import { useQuery } from "@tanstack/react-query"

import { shippingService } from "@/services/shipping.service"
import type { ShippingSettings } from "@/types/shipping"

export const DEFAULT_SHIPPING: ShippingSettings = {
  freeShippingThreshold: 200000,
  flatRate: 15000,
}

export function useShippingSettings() {
  const { data } = useQuery({
    queryKey: ["shipping", "settings"],
    queryFn: shippingService.getSettings,
    staleTime: 5 * 60 * 1000,
  })

  return data ?? DEFAULT_SHIPPING
}
