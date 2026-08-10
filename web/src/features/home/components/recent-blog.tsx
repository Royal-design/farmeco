"use client"

import { useQuery } from "@tanstack/react-query"
import { ShieldCheckIcon, SparklesIcon } from "lucide-react"

import { AnimatedButton } from "@/components/shared/animated-button"
import { GradientOrb } from "@/components/shared/gradient-orb"
import { Stagger, StaggerItem } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"
import { Skeleton } from "@/components/ui/skeleton"
import { BlogCard } from "@/features/blog/components/blog-card"
import { blogService } from "@/services/blog.service"

function RecentBlog() {
  const { data, isLoading } = useQuery({
    queryKey: ["blog", "home"],
    queryFn: () => blogService.getPosts({ page: 1, pageSize: 3 }),
  })

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="From the field"
          title="Guides & stories worth reading"
          description="Practical advice from vets, breeders and specialists who live the work."
        />
        <AnimatedButton href="/blog" variant="ghost" showArrow>
          All articles
        </AnimatedButton>
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : (
        <Stagger className="grid gap-5 md:grid-cols-3">
          {data?.items.map((post) => (
            <StaggerItem key={post.id}>
              <BlogCard post={post} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </section>
  )
}

function CtaSection() {
  return (
    <section className="relative overflow-hidden px-5 pb-20 sm:px-8 lg:px-10">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-moss to-brand px-6 py-16 text-center sm:px-12 lg:py-20">
        <GradientOrb variant="honey" className="-top-20 -right-20 opacity-30" />
        <GradientOrb variant="brand" className="-bottom-24 -left-16 opacity-40" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-foreground/20 bg-brand-foreground/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-foreground backdrop-blur">
            <SparklesIcon className="size-3.5" />
            Join 24,000+ farmers
          </span>
          <h2 className="font-heading text-4xl font-medium tracking-tight text-balance text-brand-foreground sm:text-5xl">
            Ready to meet your next herd member?
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-brand-foreground/80">
            Browse today&apos;s listings, compare health records, and get
            livestock delivered to your gate — protected by our 7-day health
            guarantee.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <AnimatedButton
              href="/shop"
              size="lg"
              className="rounded-full bg-brand-foreground text-brand hover:bg-brand-foreground/90"
            >
              Start browsing
            </AnimatedButton>
            <AnimatedButton
              href="/register"
              variant="ghost"
              size="lg"
              className="rounded-full text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground"
              showArrow={false}
            >
              <ShieldCheckIcon className="size-4" />
              Create free account
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export { CtaSection, RecentBlog }

