"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  PackageIcon,
  UserIcon,
  SettingsIcon,
  HeartIcon,
  LogOutIcon,
  MenuIcon,
  ArrowLeftIcon,
} from "lucide-react"
import { toast } from "sonner"

import { useAuthStore } from "@/store/auth-store"
import { useUIStore } from "@/store/ui-store"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/logo"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerBody,
} from "@/components/ui/drawer"

const navItems = [
  { href: "/account", label: "Overview", icon: LayoutDashboardIcon, exact: true },
  { href: "/account/orders", label: "Orders", icon: PackageIcon },
  { href: "/account/profile", label: "Profile", icon: UserIcon },
  { href: "/account/settings", label: "Settings", icon: SettingsIcon },
  { href: "/wishlist", label: "Wishlist", icon: HeartIcon },
]

function DashboardNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-1">
      {navItems.map((item) => {
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

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const openSidebar = useUIStore((state) => state.openSidebar)
  const closeSidebar = useUIStore((state) => state.closeSidebar)

  const handleLogout = async () => {
    await logout()
    toast.success("Signed out")
    closeSidebar()
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:px-10">
      <aside className="sticky top-8 hidden h-fit w-60 shrink-0 flex-col gap-6 self-start lg:flex">
        {user && (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <Avatar src={user.avatar} name={user.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
        <DashboardNav />
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
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
          <Button variant="outline" size="sm" onClick={openSidebar}>
            <MenuIcon className="size-4" />
            Menu
          </Button>
        </div>
        {children}
      </div>

      <Drawer open={sidebarOpen} onOpenChange={(open) => !open && closeSidebar()}>
        <DrawerContent side="left" className="z-[70]">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Logo showWordmark={false} />
              Dashboard
            </DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          <DrawerBody className="flex flex-col gap-5">
            <DashboardNav onNavigate={closeSidebar} />
            <div className="flex flex-col gap-1 border-t pt-4">
              <Link
                href="/shop"
                onClick={closeSidebar}
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export { DashboardShell, DashboardNav }
