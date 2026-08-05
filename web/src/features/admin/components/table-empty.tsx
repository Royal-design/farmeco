import type { LucideIcon } from "lucide-react"

import { ButtonLink } from "@/components/ui/button"

function TableEmpty({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: LucideIcon
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-brand/8 text-brand">
        <Icon className="size-6" strokeWidth={1.5} />
      </span>
      <div>
        <p className="font-heading text-base font-medium">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actionHref && actionLabel && (
        <ButtonLink href={actionHref} variant="outline" size="sm">
          {actionLabel}
        </ButtonLink>
      )}
    </div>
  )
}

export { TableEmpty }
