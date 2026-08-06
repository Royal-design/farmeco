"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { ChevronRightIcon, MoonIcon, ShieldIcon, StoreIcon, SunIcon } from "lucide-react"

import { mainNav } from "@/config/site"
import { useUIStore } from "@/store/ui-store"
import { useAuthStore } from "@/store/auth-store"
import { useMounted } from "@/hooks/use-mounted"
import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerBody,
} from "@/components/ui/drawer"
import { Logo } from "@/components/shared/logo"
import { ButtonLink } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"

function ThemeRow() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      <span className="flex items-center gap-3">
        {isDark ? (
          <SunIcon className="size-4.5 text-brand" />
        ) : (
          <MoonIcon className="size-4.5 text-brand" />
        )}
        Theme
      </span>
      <span className="text-sm text-muted-foreground capitalize">
        {mounted ? (isDark ? "Dark" : "Light") : "Light"}
      </span>
    </button>
  )
}

function MobileNav() {
  const open = useUIStore((state) => state.mobileNavOpen)
  const close = useUIStore((state) => state.closeMobileNav)
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)

  return (
    <Drawer open={open} onOpenChange={(next) => !next && close()}>
      <DrawerContent side="left" className="z-[70]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Logo showWordmark={false} />
            <span className="font-heading text-lg font-semibold tracking-tight">
              Farmeco
            </span>
            <span className="text-muted-foreground">Menu</span>
          </DrawerTitle>
          <DrawerClose />
        </DrawerHeader>
        <DrawerBody>
          {status === "authenticated" && user && (
            <Link
              href={user.role === "admin" ? "/admin" : user.role === "seller" ? "/seller" : "/account"}
              onClick={close}
              className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3"
            >
              <Avatar src={user.avatar} name={user.name} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {user.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </span>
              <ChevronRightIcon className="ml-auto size-4 text-muted-foreground" />
            </Link>
          )}

          {status === "authenticated" && user && user.role !== "buyer" && (
            <div className="mb-2 flex flex-col gap-1">
              <span className="px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Dashboard
              </span>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={close}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <ShieldIcon className="size-4.5 text-brand" />
                  Admin dashboard
                </Link>
              )}
              {user.role === "seller" && (
                <Link
                  href="/seller"
                  onClick={close}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <StoreIcon className="size-4.5 text-brand" />
                  Seller dashboard
                </Link>
              )}
            </div>
          )}

          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {mainNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand/10 text-brand"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {item.title}
                  <ChevronRightIcon className="size-4 text-muted-foreground" />
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 flex flex-col gap-2 border-t pt-4">
            <ThemeRow />
            {status !== "authenticated" ? (
              <>
                <ButtonLink href="/login" onClick={close}>
                  Sign in
                </ButtonLink>
                <ButtonLink href="/register" variant="outline" onClick={close}>
                  Create account
                </ButtonLink>
              </>
            ) : (
              <ButtonLink
                href={
                  user?.role === "admin"
                    ? "/admin"
                    : user?.role === "seller"
                      ? "/seller"
                      : "/account"
                }
                variant="outline"
                onClick={close}
              >
                Go to dashboard
              </ButtonLink>
            )}
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export { MobileNav }
