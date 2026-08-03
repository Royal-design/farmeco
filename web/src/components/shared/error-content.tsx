import Link from "next/link"
import { HomeIcon, SearchIcon } from "lucide-react"

import { Button, ButtonLink } from "@/components/ui/button"
import { GradientOrb } from "@/components/shared/gradient-orb"

function NotFoundContent() {
  return (
    <div className="relative flex min-h-[70svh] flex-col items-center justify-center gap-6 overflow-hidden px-5 text-center">
      <GradientOrb variant="brand" className="-top-20 left-1/2 -translate-x-1/2 opacity-50" />
      <GradientOrb variant="honey" size="sm" className="bottom-10 right-[15%] opacity-40" />
      <div className="relative">
        <p className="font-heading text-[7rem] leading-none font-semibold tracking-tight text-gradient-brand sm:text-[9rem]">
          404
        </p>
        <span className="mx-auto -mt-4 block w-fit rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          lost in the pasture
        </span>
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="font-heading text-2xl font-medium">Page not found</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The page you&apos;re looking for may have moved, or it never existed.
          Let&apos;s get you back to the herd.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/">
          <HomeIcon className="size-4" />
          Back home
        </ButtonLink>
        <ButtonLink href="/shop" variant="outline">
          <SearchIcon className="size-4" />
          Browse marketplace
        </ButtonLink>
      </div>
    </div>
  )
}

function ErrorContent({
  reset,
}: {
  reset?: () => void
}) {
  return (
    <div className="relative flex min-h-[70svh] flex-col items-center justify-center gap-6 overflow-hidden px-5 text-center">
      <GradientOrb variant="clay" className="-top-20 left-1/2 -translate-x-1/2 opacity-50" />
      <div className="relative">
        <p className="font-heading text-[7rem] leading-none font-semibold tracking-tight text-gradient-warm sm:text-[9rem]">
          500
        </p>
        <span className="mx-auto -mt-4 block w-fit rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          something spooked the server
        </span>
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="font-heading text-2xl font-medium">
          Something went wrong
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          An unexpected error occurred. Try again, and if it persists we&apos;d
          love to hear from you.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {reset && (
          <Button onClick={reset}>
            Try again
          </Button>
        )}
        <ButtonLink href="/contact" variant="outline">
          Contact support
        </ButtonLink>
      </div>
      <Link
        href="/"
        className="text-sm font-medium text-brand hover:underline"
      >
        Return home
      </Link>
    </div>
  )
}

export { NotFoundContent, ErrorContent }
