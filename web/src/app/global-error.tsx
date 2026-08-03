"use client"

import { ErrorContent } from "@/components/shared/error-content"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <ErrorContent reset={reset} />
      </body>
    </html>
  )
}
