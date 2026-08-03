import type { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { Hero } from "@/features/home/components/hero"
import { TrustStrip } from "@/features/home/components/trust-strip"
import { CategoryShowcase } from "@/features/home/components/category-showcase"
import { FeaturedProducts } from "@/features/home/components/featured-products"
import { HowItWorks } from "@/features/home/components/how-it-works"
import { Testimonials } from "@/features/home/components/testimonials"
import { RecentBlog, CtaSection } from "@/features/home/components/recent-blog"

export const metadata: Metadata = {
  title: `${siteConfig.name} — buy & sell healthy livestock`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: `${siteConfig.name} — buy & sell healthy livestock`,
    description: siteConfig.description,
  },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryShowcase />
      <FeaturedProducts />
      <HowItWorks />
      <Testimonials />
      <RecentBlog />
      <CtaSection />
    </>
  )
}
