"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  BellIcon,
  CheckCheckIcon,
  CreditCardIcon,
  MessageCircleIcon,
  PackageIcon,
  BellOffIcon,
  type LucideIcon,
} from "lucide-react"

import type { NotificationType } from "@/types/notification"
import { notificationsService } from "@/services/notifications.service"
import { useAuthStore } from "@/store/auth-store"
import { timeAgo } from "@/utils/format"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from "@/components/ui/dropdown-menu"

const typeIcon: Record<NotificationType, LucideIcon> = {
  message: MessageCircleIcon,
  order: PackageIcon,
  payment: CreditCardIcon,
  system: BellIcon,
}

function NotificationsMenu() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isAuthenticated = useAuthStore((state) => state.status === "authenticated")

  const unreadQuery = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: notificationsService.getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
  })

  const listQuery = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => notificationsService.getNotifications({ pageSize: 10 }),
    enabled: isAuthenticated,
  })

  if (!isAuthenticated) {
    return null
  }

  const unread = unreadQuery.data ?? 0
  const items = listQuery.data?.items ?? []

  const openNotification = async (id: string, link: string | null) => {
    if (!items.find((n) => n.id === id)?.isRead) {
      await notificationsService.markRead(id)
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    }
    if (link) {
      router.push(link)
    }
  }

  const markAllRead = async () => {
    await notificationsService.markAllRead()
    queryClient.invalidateQueries({ queryKey: ["notifications"] })
  }

  return (
    <Menu
      onOpenChange={(open) => {
        if (open) {
          queryClient.invalidateQueries({ queryKey: ["notifications"] })
        }
      }}
    >
      <MenuTrigger
        className="relative inline-flex items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label={`Notifications, ${unread} unread`}
      >
        <span className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <BellIcon className="size-4" />
        </span>
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[0.6rem] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </MenuTrigger>

      <MenuContent className="w-80 p-2" align="end">
        <div className="flex items-center justify-between px-2 py-1">
          <p className="text-sm font-medium">Notifications</p>
          {unread > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              <CheckCheckIcon className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>
        <MenuSeparator />

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <BellOffIcon className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">You&apos;re all caught up</p>
          </div>
        ) : (
          <div className="flex max-h-80 flex-col overflow-y-auto">
            {items.map((notification) => {
              const Icon = typeIcon[notification.type]
              return (
                <MenuItem
                  key={notification.id}
                  onClick={() => openNotification(notification.id, notification.link)}
                  className={cn("items-start", !notification.isRead && "bg-brand/5")}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                      notification.isRead
                        ? "bg-muted text-muted-foreground"
                        : "bg-brand/10 text-brand"
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">
                        {notification.title}
                      </span>
                      {!notification.isRead && (
                        <span className="size-2 shrink-0 rounded-full bg-brand" />
                      )}
                    </span>
                    {notification.body && (
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                        {notification.body}
                      </span>
                    )}
                    <span className="mt-0.5 block text-[0.7rem] text-muted-foreground/80">
                      {timeAgo(notification.createdAt)}
                    </span>
                  </span>
                </MenuItem>
              )
            })}
          </div>
        )}

        <MenuSeparator />
        <div className="p-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => router.push("/account/notifications")}
          >
            View all
          </Button>
        </div>
      </MenuContent>
    </Menu>
  )
}

export { NotificationsMenu }
