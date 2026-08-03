import type { Metadata } from "next"
import { Suspense } from "react"

import { LoginForm } from "@/features/auth/components/login-form"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Pasture & Co. account.",
  robots: { index: false, follow: true },
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
