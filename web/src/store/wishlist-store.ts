"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUuid(value: string): boolean {
  return UUID_RE.test(value)
}

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
      toggle: (productId) => {
        if (!isValidUuid(productId)) return
        set((state) => ({
          ids: state.ids.includes(productId)
            ? state.ids.filter((id) => id !== productId)
            : [...state.ids, productId],
        }))
      },
      add: (productId) => {
        if (!isValidUuid(productId)) return
        set((state) =>
          state.ids.includes(productId)
            ? state
            : { ids: [...state.ids, productId] }
        )
      },
      remove: (productId) =>
        set((state) => ({
          ids: state.ids.filter((id) => id !== productId),
        })),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "farmeco.wishlist",
      merge: (persisted, current) => {
        const stored = persisted as Partial<WishlistState> | undefined
        const ids = Array.isArray(stored?.ids) ? stored.ids : []
        return { ...current, ids: ids.filter(isValidUuid) }
      },
    }
  )
)
