"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/store/auth-store"
import { Skeleton } from "@/components/ui/skeleton"

function CheckoutGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const status = useAuthStore((state) => state.status)
  const hydrate = useAuthStore((state) => state.hydrate)

  React.useEffect(() => {
    if (status === "idle") {
      hydrate()
    }
  }, [status, hydrate])

  if (status === "idle" || status === "loading") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.replace("/login?redirect=/checkout")
    return null
  }

  return <>{children}</>
}

export { CheckoutGuard }
