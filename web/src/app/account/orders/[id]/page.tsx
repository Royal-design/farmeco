import { OrderDetail } from "@/features/dashboard/components/order-detail"

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  return <OrderDetail orderId={id} />
}
