"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/store/auth-store"
import { Skeleton } from "@/components/ui/skeleton"

function AccountGuard({ children }: { children: React.ReactNode }) {
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
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <Skeleton className="mb-6 h-9 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.replace("/login?redirect=/account")
    return null
  }

  return <>{children}</>
}

export { AccountGuard }
