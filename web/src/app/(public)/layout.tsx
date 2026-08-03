import { SiteHeader } from "@/layouts/site-header"
import { SiteFooter } from "@/layouts/site-footer"
import { MobileNav } from "@/layouts/mobile-nav"
import { CartDrawer } from "@/features/cart/components/cart-drawer"
import { SearchDialog } from "@/components/shared/search-dialog"

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <MobileNav />
      <CartDrawer />
      <SearchDialog />
    </div>
  )
}
