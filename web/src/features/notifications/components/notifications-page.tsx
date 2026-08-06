"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  BellIcon,
  BellOffIcon,
  CheckCheckIcon,
  CreditCardIcon,
  MessageCircleIcon,
  PackageIcon,
  type LucideIcon,
} from "lucide-react"

import type { NotificationType } from "@/types/notification"
import { notificationsService } from "@/services/notifications.service"
import { formatDate } from "@/utils/format"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"

const typeIcon: Record<NotificationType, LucideIcon> = {
  message: MessageCircleIcon,
  order: PackageIcon,
  payment: CreditCardIcon,
  system: BellIcon,
}

function NotificationsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", "all"],
    queryFn: () => notificationsService.getNotifications({ pageSize: 100 }),
  })

  const items = data?.items ?? []

  const markAllRead = async () => {
    await notificationsService.markAllRead()
    queryClient.invalidateQueries({ queryKey: ["notifications"] })
  }

  const open = async (id: string, link: string | null) => {
    const notification = items.find((n) => n.id === id)
    if (notification && !notification.isRead) {
      await notificationsService.markRead(id)
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    }
    if (link) {
      router.push(link)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-20 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <EmptyState
          icon={BellIcon}
          title="No notifications yet"
          description="Updates about your orders, messages and payments will show up here."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Updates about your orders, messages and payments.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <CheckCheckIcon className="size-4" />
          Mark all read
        </Button>
      </div>

      <ul className="flex flex-col gap-2.5">
        {items.map((notification) => {
          const Icon = typeIcon[notification.type]
          return (
            <li key={notification.id}>
              <button
                type="button"
                onClick={() => open(notification.id, notification.link)}
                className={cn(
                  "flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors",
                  notification.isRead
                    ? "border-border bg-card"
                    : "border-brand/25 bg-brand/5 hover:bg-brand/8"
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full",
                    notification.isRead
                      ? "bg-muted text-muted-foreground"
                      : "bg-brand/10 text-brand"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {notification.title}
                    </span>
                    {!notification.isRead && (
                      <span className="size-2 shrink-0 rounded-full bg-brand" />
                    )}
                  </span>
                  {notification.body && (
                    <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">
                      {notification.body}
                    </span>
                  )}
                  <span className="mt-1 block text-xs text-muted-foreground/80">
                    {formatDate(notification.createdAt)}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { NotificationsPage }
