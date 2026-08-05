"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import type { UserRole } from "@/types/user"
import { useAuthStore } from "@/store/auth-store"
import { GuardSkeleton } from "@/features/dashboard/components/dashboard-shell"

interface RoleGuardProps {
  roles: UserRole[]
  fallback?: string
  children: React.ReactNode
}

function RoleGuard({ roles, fallback = "/account", children }: RoleGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const status = useAuthStore((state) => state.status)
  const user = useAuthStore((state) => state.user)
  const hydrate = useAuthStore((state) => state.hydrate)

  React.useEffect(() => {
    if (status === "idle") {
      hydrate()
    }
  }, [status, hydrate])

  if (status === "idle" || status === "loading") {
    return <GuardSkeleton />
  }

  if (status === "unauthenticated") {
    router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    return null
  }

  if (user && !roles.includes(user.role)) {
    router.replace(fallback)
    return null
  }

  return <>{children}</>
}

export { RoleGuard }
