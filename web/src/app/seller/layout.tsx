import type { Metadata } from "next"

import { RoleGuard } from "@/features/admin/components/role-guard"
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell"

export const metadata: Metadata = {
  title: "Seller",
  description: "Farmeco seller dashboard.",
  robots: { index: false, follow: false },
}

export default function SellerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RoleGuard roles={["seller", "admin"]} fallback="/account">
      <DashboardShell kind="seller" title="Seller">
        {children}
      </DashboardShell>
    </RoleGuard>
  )
}
