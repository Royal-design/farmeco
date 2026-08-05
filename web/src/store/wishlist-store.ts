"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistState {
  ids: string[]
  toggle: (productId: string) => void
  add: (productId: string) => void
  remove: (productId: string) => void
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (productId) =>
        set((state) => ({
          ids: state.ids.includes(productId)
            ? state.ids.filter((id) => id !== productId)
            : [...state.ids, productId],
        })),
      add: (productId) =>
        set((state) =>
          state.ids.includes(productId)
            ? state
            : { ids: [...state.ids, productId] }
        ),
      remove: (productId) =>
        set((state) => ({
          ids: state.ids.filter((id) => id !== productId),
        })),
      clear: () => set({ ids: [] }),
    }),
    { name: "farmeco.wishlist" }
  )
)
