import type { ContactMessageStatus } from "@/types/message"
import { Badge } from "@/components/ui/badge"

const statusMeta: Record<
  ContactMessageStatus,
  { label: string; tone: "neutral" | "info" | "success" | "warning" | "danger" }
> = {
  new: { label: "New", tone: "warning" },
  read: { label: "Seen", tone: "neutral" },
  replied: { label: "Replied", tone: "success" },
}

function MessageStatusBadge({ status }: { status: ContactMessageStatus }) {
  const meta = statusMeta[status]
  return <Badge variant={meta.tone}>{meta.label}</Badge>
}

export { MessageStatusBadge }
