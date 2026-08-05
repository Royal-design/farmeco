import {
  FileTextIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  TagsIcon,
  TicketIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

export interface DashboardNavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

export const adminNavItems: DashboardNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboardIcon, exact: true },
  { href: "/admin/products", label: "Products", icon: PackageIcon },
  { href: "/admin/categories", label: "Categories", icon: TagsIcon },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCartIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/coupons", label: "Coupons", icon: TicketIcon },
  { href: "/admin/blog", label: "Blog", icon: FileTextIcon },
]

export const sellerNavItems: DashboardNavItem[] = [
  { href: "/seller", label: "Overview", icon: LayoutDashboardIcon, exact: true },
  { href: "/seller/products", label: "My products", icon: PackageIcon },
  { href: "/seller/orders", label: "Orders", icon: ShoppingCartIcon },
]
