import type { OrderStatus } from "@/types/order"
import { orderStatusMeta } from "@/constants/order"
import { Badge } from "@/components/ui/badge"

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = orderStatusMeta[status]
  return <Badge variant={meta.tone}>{meta.label}</Badge>
}

export { OrderStatusBadge }
