"use client"

import type { OrderStatus } from "@/types/order"
import { orderStatuses, orderStatusMeta } from "@/constants/order"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StatusSelectProps {
  value: OrderStatus
  onValueChange: (status: OrderStatus) => void
  disabled?: boolean
}

function StatusSelect({ value, onValueChange, disabled }: StatusSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next as OrderStatus)}
      disabled={disabled}
      items={orderStatuses.map((status) => ({
        value: status,
        label: orderStatusMeta[status].label,
      }))}
    >
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {orderStatuses.map((status) => (
          <SelectItem key={status} value={status}>
            {orderStatusMeta[status].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { StatusSelect }
