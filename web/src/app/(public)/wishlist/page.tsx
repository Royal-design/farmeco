import type { Metadata } from "next"

import { WishlistView } from "@/features/wishlist/components/wishlist-view"

export const metadata: Metadata = {
  title: "Your wishlist",
  description: "Saved listings you're interested in.",
  alternates: { canonical: "/wishlist" },
}

export default function WishlistPage() {
  return <WishlistView />
}
