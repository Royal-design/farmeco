"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeftIcon, MessageSquareReplyIcon } from "lucide-react"

import { messagesService } from "@/services/messages.service"
import { formatDate } from "@/utils/format"
import { MessageStatusBadge } from "@/features/dashboard/components/message-status-badge"
import { Skeleton } from "@/components/ui/skeleton"

interface MessageDetailViewProps {
  messageId: string
}

function MessageDetailView({ messageId }: MessageDetailViewProps) {
  const router = useRouter()

  const { data: message, isLoading } = useQuery({
    queryKey: ["message", messageId],
    queryFn: () => messagesService.getMessage(messageId),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    )
  }

  if (!message) {
    return (
      <div className="flex flex-col gap-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-medium">Message not found</h1>
        <Link
          href="/account/messages"
          className="text-sm font-medium text-brand hover:underline"
        >
          Back to messages
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => router.push("/account/messages")}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeftIcon className="size-4" />
        All messages
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-medium tracking-tight">
            {message.subject}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {message.ticket} · {formatDate(message.createdAt)}
          </p>
        </div>
        <MessageStatusBadge status={message.status} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Your message
        </h2>
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {message.message}
        </p>
      </div>

      {message.adminReply ? (
        <div className="rounded-2xl border border-brand/25 bg-brand/5 p-5">
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-brand uppercase">
            <MessageSquareReplyIcon className="size-4" />
            Response
          </h2>
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {message.adminReply}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            From {message.repliedByName ?? "Farmeco"} ·{" "}
            {formatDate(message.repliedAt ?? message.createdAt)}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          No response yet — our team will get back to you soon.
        </div>
      )}
    </div>
  )
}

export { MessageDetailView }
