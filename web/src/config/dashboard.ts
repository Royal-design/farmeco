import {
  FileTextIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  PackageIcon,
  ScrollTextIcon,
  SettingsIcon,
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
  { href: "/admin/messages", label: "Messages", icon: MessageCircleIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/coupons", label: "Coupons", icon: TicketIcon },
  { href: "/admin/blog", label: "Blog", icon: FileTextIcon },
  { href: "/admin/audit-log", label: "Audit log", icon: ScrollTextIcon },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
]

export const sellerNavItems: DashboardNavItem[] = [
  { href: "/seller", label: "Overview", icon: LayoutDashboardIcon, exact: true },
  { href: "/seller/products", label: "My products", icon: PackageIcon },
  { href: "/seller/orders", label: "Orders", icon: ShoppingCartIcon },
  { href: "/seller/messages", label: "Messages", icon: MessageCircleIcon },
]
