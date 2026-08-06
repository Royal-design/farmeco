"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  SearchIcon,
  ShoppingBagIcon,
  HeartIcon,
  MenuIcon,
  UserIcon,
  LogOutIcon,
  PackageIcon,
  SettingsIcon,
  LayoutDashboardIcon,
  StoreIcon,
  ShieldIcon,
} from "lucide-react"
import { toast } from "sonner"

import { mainNav } from "@/config/site"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { useAuthStore } from "@/store/auth-store"
import { useCartStore, selectCartCount } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import { useScrollPosition } from "@/hooks/use-scroll-position"
import { Logo } from "@/components/shared/logo"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { NotificationsMenu } from "@/features/notifications/components/notifications-menu"
import { Button, ButtonLink } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuLabel,
} from "@/components/ui/dropdown-menu"

function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-brand via-moss to-brand px-4 py-2 text-center">
      <p className="text-xs font-medium tracking-wide text-brand-foreground">
        Free doorstep delivery on orders over ₦200,000 ·{" "}
        <span className="underline underline-offset-2">Health-checked livestock</span>{" "}
        from verified farms
      </p>
    </div>
  )
}

function HeaderNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
      {mainNav.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.title}
            {active && (
              <span className="absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-brand" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

function AccountMenu() {
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    toast.success("Signed out successfully")
    window.location.href = "/"
  }

  if (status === "authenticated" && user) {
    return (
      <Menu>
        <MenuTrigger
          className="inline-flex items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Account menu"
        >
          <Avatar src={user.avatar} name={user.name} size="sm" className="ring-2 ring-brand/20 transition-transform hover:scale-105" />
        </MenuTrigger>
        <MenuContent>
          <MenuLabel>
            <span className="block font-medium text-foreground">{user.name}</span>
            <span className="text-xs">{user.email}</span>
          </MenuLabel>
          <MenuSeparator />
          <MenuItem onClick={() => router.push("/account")}>
            <LayoutDashboardIcon className="size-4 text-muted-foreground" />
            Dashboard
          </MenuItem>
          <MenuItem onClick={() => router.push("/account/orders")}>
            <PackageIcon className="size-4 text-muted-foreground" />
            Orders
          </MenuItem>
          <MenuItem onClick={() => router.push("/wishlist")}>
            <HeartIcon className="size-4 text-muted-foreground" />
            Wishlist
          </MenuItem>
          <MenuItem onClick={() => router.push("/account/profile")}>
            <UserIcon className="size-4 text-muted-foreground" />
            Profile
          </MenuItem>
          <MenuItem onClick={() => router.push("/account/settings")}>
            <SettingsIcon className="size-4 text-muted-foreground" />
            Settings
          </MenuItem>
          <MenuSeparator />
          {(user.role === "admin" || user.role === "seller") && (
            <>
              {user.role === "admin" && (
                <MenuItem onClick={() => router.push("/admin")}>
                  <ShieldIcon className="size-4 text-muted-foreground" />
                  Admin dashboard
                </MenuItem>
              )}
              {user.role === "seller" && (
                <MenuItem onClick={() => router.push("/seller")}>
                  <StoreIcon className="size-4 text-muted-foreground" />
                  Seller dashboard
                </MenuItem>
              )}
              <MenuSeparator />
            </>
          )}
          <MenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            <LogOutIcon className="size-4" />
            Sign out
          </MenuItem>
        </MenuContent>
      </Menu>
    )
  }

  return (
    <ButtonLink href="/login" variant="outline" size="sm" className="hidden sm:inline-flex">
      <UserIcon className="size-3.5" />
      Sign in
    </ButtonLink>
  )
}

function SiteHeader() {
  const scrolled = useScrollPosition(16)
  const openSearch = useUIStore((state) => state.openSearch)
  const openMobileNav = useUIStore((state) => state.openMobileNav)
  const openCart = useCartStore((state) => state.openCart)
  const count = useCartStore(selectCartCount)
  const wishlistCount = useWishlistStore((state) => state.ids.length)

  return (
    <div className="sticky top-0 z-40">
      <AnnouncementBar />
      <header
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "glass border-border/60"
            : "border-transparent bg-background/60 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={openMobileNav}
              aria-label="Open menu"
            >
              <MenuIcon className="size-5" />
            </Button>
            <Logo />
          </div>

          <HeaderNav />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={openSearch}
              aria-label="Search marketplace"
            >
              <SearchIcon className="size-4" />
            </Button>
            <ThemeToggle />

            <NotificationsMenu />

            <ButtonLink
              href="/wishlist"
              variant="ghost"
              size="icon"
              aria-label={`Wishlist, ${wishlistCount} items`}
              className="relative"
            >
              <HeartIcon className="size-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-clay text-[0.6rem] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </ButtonLink>

            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              aria-label={`Open cart, ${count} items`}
              className="relative"
            >
              <ShoppingBagIcon className="size-4" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-brand text-[0.6rem] font-semibold text-brand-foreground">
                  {count}
                </span>
              )}
            </Button>

            <div className="ml-1">
              <AccountMenu />
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export { SiteHeader }
