"use client"

import { useTheme } from "next-themes"
import { Toaster } from "sonner"

function SonnerProvider() {
  const { resolvedTheme } = useTheme()

  return (
    <Toaster
      position="top-center"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        style: {
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border)",
        },
      }}
      richColors
      closeButton
    />
  )
}

export { SonnerProvider }
