"use client"

import * as React from "react"

import { QueryProvider } from "@/providers/query-provider"
import { SonnerProvider } from "@/providers/sonner-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { useAuthStore } from "@/store/auth-store"

function AuthHydrator() {
  const hydrate = useAuthStore((state) => state.hydrate)

  React.useEffect(() => {
    hydrate()
  }, [hydrate])

  return null
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthHydrator />
        {children}
        <SonnerProvider />
      </QueryProvider>
    </ThemeProvider>
  )
}

export { AppProviders }
