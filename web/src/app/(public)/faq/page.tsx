import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { Accordion } from "@/components/ui/accordion"
import { ButtonLink } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about buying livestock, health certificates, delivery, payments and selling on Pasture & Co.",
  alternates: { canonical: "/faq" },
}

const faqs = [
  {
    question: "How do you verify farms and animals?",
    answer:
      "Every seller's farm location is verified before they can list. Each animal carries its health paperwork — vaccination logs, vet reports and, where relevant, DNA or registration certificates — which you can review before you buy.",
  },
  {
    question: "What does the 7-day health guarantee cover?",
    answer:
      "If an animal shows signs of a serious illness or a pre-existing condition within 7 days of delivery, we'll help you arrange a vet assessment and a replacement or refund. The full terms are shown at checkout.",
  },
  {
    question: "How does live-animal delivery work?",
    answer:
      "We partner with licensed hauliers using biosecure crates. When you order, you pick a delivery window and the seller and haulier coordinate. Live animals are typically delivered within 3–5 days, depending on distance.",
  },
  {
    question: "Can I see the animal before I commit?",
    answer:
      "Yes. Many sellers offer video calls or on-farm visits. You can message any seller directly from a listing, and we recommend a pre-purchase vet exam for breeding animals.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept debit and credit cards, bank transfer and cash on delivery. Payments are encrypted and only released to the seller once the delivery is confirmed.",
  },
  {
    question: "How much does it cost to sell?",
    answer:
      "Sellers keep 96% of every sale — we charge a flat 4% marketplace fee with no listing fees. There are no hidden charges, and sellers are paid within 2 business days of confirmed delivery.",
  },
  {
    question: "What if the animal arrives unhealthy?",
    answer:
      "Contact us within 48 hours with photos and any vet notes. Our support team will work with you and the seller to arrange treatment, a replacement or a refund under the health guarantee.",
  },
  {
    question: "Do you deliver to my area?",
    answer:
      "We currently serve 40 states. During checkout you'll see live delivery options for your zip code. Rural delivery is available through our network of regional hauliers.",
  },
]

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Questions, answered"
        description="Everything you need to know about buying and selling on Pasture & Co. Can't find your answer? Just ask."
        crumbs={[{ label: "FAQ" }]}
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.6fr] lg:px-10">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <h2 className="font-heading text-2xl font-medium tracking-tight">
            Still have questions?
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Our support team replies within 24 hours, Monday to Saturday.
          </p>
          <ButtonLink href="/contact" className="mt-5">
            Contact support
          </ButtonLink>
        </div>
        <Accordion items={faqs} />
      </div>
    </>
  )
}
