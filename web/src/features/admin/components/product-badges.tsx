import type { ProductBadge } from "@/types/catalog"
import { badgeMeta } from "@/constants/order"
import { Badge } from "@/components/ui/badge"

type BadgeTone =
  | "brand"
  | "honey"
  | "moss"
  | "clay"
  | "neutral"
  | "success"
  | "warning"
  | "info"
  | "danger"

function ProductBadges({ badges, max = 3 }: { badges: ProductBadge[]; max?: number }) {
  if (!badges.length) {
    return <span className="text-xs text-muted-foreground">—</span>
  }
  const visible = badges.slice(0, max)
  const rest = badges.length - visible.length
  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((badge) => {
        const meta = badgeMeta[badge]
        if (!meta) {
          return null
        }
        return (
          <Badge key={badge} variant={meta.tone as BadgeTone}>
            {meta.label}
          </Badge>
        )
      })}
      {rest > 0 && <span className="text-xs text-muted-foreground">+{rest}</span>}
    </div>
  )
}

export { ProductBadges }
