import type { Metadata } from "next"

import { RegisterForm } from "@/features/auth/components/register-form"

export const metadata: Metadata = {
  title: "Create an account",
  description: "Join Pasture & Co. — buy and sell healthy livestock.",
  robots: { index: false, follow: true },
}

export default function RegisterPage() {
  return <RegisterForm />
}
