"use client"

import * as React from "react"

import { QueryProvider } from "@/providers/query-provider"
import { SonnerProvider } from "@/providers/sonner-provider"
import { ThemeProvider } from "@/providers/theme-provider"

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <SonnerProvider />
      </QueryProvider>
    </ThemeProvider>
  )
}

export { AppProviders }
