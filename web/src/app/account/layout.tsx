import type { Metadata } from "next"

import { DashboardShell } from "@/features/dashboard/components/dashboard-shell"
import { AccountGuard } from "@/features/dashboard/components/account-guard"

export const metadata: Metadata = {
  title: "My account",
  description: "Manage your Pasture & Co. account, orders and settings.",
  robots: { index: false, follow: true },
}

export default function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AccountGuard>
      <DashboardShell>{children}</DashboardShell>
    </AccountGuard>
  )
}
