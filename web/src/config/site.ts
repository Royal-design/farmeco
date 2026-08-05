export const siteConfig = {
  name: "Farmeco",
  shortName: "Farmeco",
  tagline: "The modern marketplace for livestock & poultry",
  description:
    "Buy and sell premium cattle, goats, sheep, pigs, poultry and farm essentials with trusted local farms. Verified sellers, health-certified animals, and doorstep delivery.",
  url: "https://farmeco.example.com",
  ogImage: "/og/cover.svg",
  links: {
    twitter: "https://twitter.com",
    github: "https://github.com",
  },
  supportEmail: "care@farmeco.example.com",
  phone: "+234 800 123 4567",
  location: "Karu, Federal Capital Territory",
} as const

export type SiteConfig = typeof siteConfig

export const mainNav = [
  { title: "Home", href: "/" },
  { title: "Marketplace", href: "/shop" },
  { title: "Categories", href: "/categories" },
  { title: "About", href: "/about" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
] as const

export const footerLinks = {
  marketplace: [
    { title: "Cattle", href: "/shop?category=cattle" },
    { title: "Goats & Sheep", href: "/shop?category=goats-sheep" },
    { title: "Pigs", href: "/shop?category=pigs" },
    { title: "Poultry", href: "/shop?category=poultry" },
    { title: "Feed & Supplies", href: "/shop?category=supplies" },
  ],
  company: [
    { title: "About us", href: "/about" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
    { title: "FAQ", href: "/faq" },
  ],
  account: [
    { title: "My account", href: "/account" },
    { title: "Orders", href: "/account/orders" },
    { title: "Wishlist", href: "/wishlist" },
    { title: "Settings", href: "/account/settings" },
  ],
} as const
