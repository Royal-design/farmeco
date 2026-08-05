"use client"

import { useQuery } from "@tanstack/react-query"

import { testimonialsService } from "@/services/testimonials.service"
import { SectionHeading } from "@/components/shared/section-heading"
import { Marquee } from "@/components/shared/marquee"
import { Avatar } from "@/components/ui/avatar"
import { Rating } from "@/components/ui/rating"
import { Skeleton } from "@/components/ui/skeleton"
import type { Testimonial } from "@/types/catalog"

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex w-80 shrink-0 flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-brand/25 hover:shadow-lift sm:w-[24rem]">
      <Rating value={testimonial.rating} size="sm" />
      <blockquote className="text-sm leading-relaxed text-foreground/90">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t pt-4">
        <Avatar
          src={testimonial.avatar}
          name={testimonial.author}
          size="sm"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{testimonial.author}</span>
          <span className="text-xs text-muted-foreground">{testimonial.role}</span>
        </div>
      </figcaption>
    </figure>
  )
}

function Testimonials() {
  const { data, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: testimonialsService.getTestimonials,
  })

  return (
    <section className="border-y border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          align="center"
          eyebrow="Testimonials"
          title="Farmers trust Farmeco"
          description="Tens of thousands of animals moved between farmers who love the marketplace."
          className="mb-12"
        />
      </div>

      {isLoading ? (
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : (
        <Marquee speed={48}>
          {[0, 1].map((repetition) =>
            (data ?? []).map((testimonial) => (
              <div
                key={`${repetition}-${testimonial.id}`}
                className="px-3 py-1"
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))
          )}
        </Marquee>
      )}
    </section>
  )
}

export { Testimonials }
