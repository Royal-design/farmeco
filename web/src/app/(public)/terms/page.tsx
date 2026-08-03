import type { Metadata } from "next"

import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the Pasture & Co. marketplace.",
  robots: { index: false, follow: true },
}

const sections = [
  {
    title: "1. The marketplace",
    body: "Pasture & Co. is an online marketplace connecting buyers and sellers of livestock, poultry and farm essentials. We facilitate the transaction but each listing remains the responsibility of the individual seller.",
  },
  {
    title: "2. Accounts",
    body: "You must provide accurate information when creating an account and keep your login credentials secure. You are responsible for all activity under your account.",
  },
  {
    title: "3. Buyers",
    body: "All purchases are subject to the animal's health records as listed. The 7-day health guarantee applies to serious illness or pre-existing conditions identified by a veterinarian within the guarantee window, as described in the checkout terms.",
  },
  {
    title: "4. Sellers",
    body: "Sellers must be location-verified and list only animals they own or are authorised to sell. Listings must include accurate health records. A flat 4% marketplace fee applies to each completed sale.",
  },
  {
    title: "5. Payments & delivery",
    body: "Payments are released to sellers 2 business days after confirmed delivery. Delivery is coordinated with licensed hauliers and subject to regional availability.",
  },
  {
    title: "6. Prohibited conduct",
    body: "We prohibit misrepresentation of animals or health status, fraudulent activity, and any conduct that harms other users. We may suspend accounts that violate these terms.",
  },
  {
    title: "7. Liability",
    body: "While we verify farms and facilitate transactions, buyers and sellers remain responsible for their own decisions and interactions. Our liability is limited to the maximum extent permitted by law.",
  },
  {
    title: "8. Changes",
    body: "We may update these terms from time to time. Continued use of the marketplace after changes means you accept the updated terms.",
  },
]

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <h1 className="font-heading text-4xl font-medium tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: July 2026 · {siteConfig.name}
      </p>
      <div className="mt-8 flex flex-col gap-6">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 font-heading text-lg font-medium">{section.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
