"use client"

import { ArrowUpDownIcon } from "lucide-react"

import { sortOptions } from "@/constants/sorting"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SortSelectProps {
  value: string
  onValueChange: (value: string) => void
}

function SortSelect({ value, onValueChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDownIcon className="size-4 text-muted-foreground" />
      <Select
        value={value}
        onValueChange={(next) => onValueChange(next ?? "popular")}
        items={sortOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        aria-label="Sort products"
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { SortSelect }
