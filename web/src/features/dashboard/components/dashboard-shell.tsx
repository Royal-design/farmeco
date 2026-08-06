"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowLeftIcon,
  HeartIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  MessageCircleIcon,
  PackageIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"
import { toast } from "sonner"

import type { UserRole } from "@/types/user"
import type { DashboardNavItem } from "@/config/dashboard"
import { adminNavItems, sellerNavItems } from "@/config/dashboard"

const accountNavItems: DashboardNavItem[] = [
  { href: "/account", label: "Overview", icon: LayoutDashboardIcon, exact: true },
  { href: "/account/orders", label: "Orders", icon: PackageIcon },
  { href: "/account/messages", label: "Messages", icon: MessageCircleIcon },
  { href: "/account/profile", label: "Profile", icon: UserIcon },
  { href: "/account/settings", label: "Settings", icon: SettingsIcon },
  { href: "/wishlist", label: "Wishlist", icon: HeartIcon },
]
import { useAuthStore } from "@/store/auth-store"
import { useUIStore } from "@/store/ui-store"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/logo"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

const roleLabel: Record<UserRole, string> = {
  admin: "Administrator",
  seller: "Seller",
  buyer: "Buyer",
}

function DashboardNav({
  items,
  onNavigate,
}: {
  items: DashboardNavItem[]
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand/10 text-brand"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-4.5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

type DashboardKind = "account" | "admin" | "seller"

interface DashboardShellProps {
  kind?: DashboardKind
  title?: string
  children: React.ReactNode
}

function DashboardShell({ kind = "account", title, children }: DashboardShellProps) {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navItems: DashboardNavItem[] =
    kind === "admin" ? adminNavItems : kind === "seller" ? sellerNavItems : accountNavItems
  const resolvedTitle =
    title ??
    (kind === "admin" ? "Admin" : kind === "seller" ? "Seller" : "Dashboard")
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const openSidebar = useUIStore((state) => state.openSidebar)
  const closeSidebar = useUIStore((state) => state.closeSidebar)

  const handleLogout = async () => {
    await logout()
    toast.success("Signed out")
    window.location.href = "/"
  }

  const sidebar = (
    <>
      {user && (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <Avatar src={user.avatar} name={user.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant="brand" className="ml-auto shrink-0">
            {user.role}
          </Badge>
        </div>
      )}
      <DashboardNav items={navItems} />
      <div className="flex flex-col gap-1 border-t pt-4">
        <Link
          href="/shop"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4.5" />
          Back to shop
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOutIcon className="size-4.5" />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:px-10">
      <aside className="sticky top-8 hidden h-fit w-60 shrink-0 flex-col gap-6 self-start lg:flex">
        {sidebar}
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
          <Button variant="outline" size="sm" onClick={openSidebar}>
            <MenuIcon className="size-4" />
            {resolvedTitle}
          </Button>
          {user && (
            <span className="text-xs font-medium text-muted-foreground capitalize">
              {roleLabel[user.role]}
            </span>
          )}
        </div>
        {children}
      </div>

      <Drawer open={sidebarOpen} onOpenChange={(open) => !open && closeSidebar()}>
        <DrawerContent side="left" className="z-[70]">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Logo showWordmark={false} />
              {resolvedTitle}
            </DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          <DrawerBody className="flex flex-col gap-5">
            {sidebar}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export { DashboardShell }

// Skeleton used by role guards while restoring the session
export function GuardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <Skeleton className="mb-6 h-9 w-56" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
