import type { Metadata } from "next"

import { RoleGuard } from "@/features/admin/components/role-guard"
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell"

export const metadata: Metadata = {
  title: "Admin",
  description: "Farmeco admin dashboard.",
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RoleGuard roles={["admin"]} fallback="/account">
      <DashboardShell kind="admin" title="Admin">
        {children}
      </DashboardShell>
    </RoleGuard>
  )
}
