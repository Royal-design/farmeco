import type { Metadata } from "next"

import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Pasture & Co. collects, uses and protects your data.",
  robots: { index: false, follow: true },
}

const sections = [
  {
    title: "1. Information we collect",
    body: "We collect the information you provide when you create an account, place an order, list an animal or contact support — including your name, email, phone number, delivery address and order history. We also collect limited technical data such as device type and browsing activity to keep the service secure and improve the experience.",
  },
  {
    title: "2. How we use your information",
    body: "Your information is used to process orders, coordinate deliveries, communicate with you about your account and orders, prevent fraud, and improve our marketplace. With your consent, we may send marketing emails about new listings and farm offers — you can opt out at any time from your settings.",
  },
  {
    title: "3. Sharing with sellers and hauliers",
    body: "To deliver your order, we share your delivery details (name, phone, address) with the seller and the licensed haulier handling your delivery. We never sell your personal data to third parties.",
  },
  {
    title: "4. Payment security",
    body: "Card payments are processed by PCI-DSS compliant payment providers. We never store full card numbers on our servers.",
  },
  {
    title: "5. Cookies",
    body: "We use essential cookies to keep you signed in and remember your cart, plus analytics cookies to understand how the marketplace is used. You can manage cookies in your browser settings.",
  },
  {
    title: "6. Your rights",
    body: "You can access, correct or delete your personal data at any time from your account settings, or by contacting us. We respond to all data requests within 30 days.",
  },
  {
    title: "7. Contact",
    body: `For any privacy questions, email ${siteConfig.supportEmail} or write to ${siteConfig.location}.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <h1 className="font-heading text-4xl font-medium tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: July 2026
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
