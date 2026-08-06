"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { ChevronRightIcon, InboxIcon } from "lucide-react"

import { messagesService } from "@/services/messages.service"
import { formatDate } from "@/utils/format"
import { MessageStatusBadge } from "@/features/dashboard/components/message-status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { ButtonLink } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function MessagesView() {
  const { data, isLoading } = useQuery({
    queryKey: ["messages", "my"],
    queryFn: () => messagesService.getMyMessages({ pageSize: 50 }),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-20 rounded-2xl" />
        ))}
      </div>
    )
  }

  const items = data?.items ?? []

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <EmptyState
          icon={InboxIcon}
          title="No messages yet"
          description="Messages you send through the contact form will appear here, along with any replies."
          action={
            <ButtonLink href="/contact">
              Contact us
              <ChevronRightIcon className="size-4" />
            </ButtonLink>
          }
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your questions and the responses you&apos;ve received.
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {items.map((message) => {
          const hasNewReply =
            message.status === "replied" && !message.userReadAt
          return (
            <li key={message.id}>
              <Link
                href={`/account/messages/${message.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-brand/25 hover:bg-accent/40"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {message.subject}
                    </p>
                    {hasNewReply && (
                      <span className="size-2 shrink-0 rounded-full bg-brand" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {message.ticket} · {formatDate(message.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <MessageStatusBadge status={message.status} />
                  <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { MessagesView }
