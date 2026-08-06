import { MessageDetailView } from "@/features/dashboard/components/message-detail-view"

export default async function AccountMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <MessageDetailView messageId={id} />
}
