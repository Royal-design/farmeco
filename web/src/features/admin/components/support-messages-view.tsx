"use client"

import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { SearchIcon, SendIcon, InboxIcon } from "lucide-react"
import { toast } from "sonner"

import type { ContactMessageStatus } from "@/types/message"
import { messagesService } from "@/services/messages.service"
import { getErrorMessage } from "@/lib/errors"
import { formatDate } from "@/utils/format"
import { useDebounce } from "@/hooks/use-debounce"
import { MessageStatusBadge } from "@/features/dashboard/components/message-status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/admin/components/table"
import { TableEmpty } from "@/features/admin/components/table-empty"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const statusTabs: Array<{ value: ContactMessageStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "read", label: "Seen" },
  { value: "replied", label: "Replied" },
]

function SupportMessagesView() {
  const queryClient = useQueryClient()
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState<ContactMessageStatus | "all">("all")
  const [expanded, setExpanded] = React.useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 350)

  const { data, isLoading } = useQuery({
    queryKey: ["messages", "staff", page, debouncedSearch, status],
    queryFn: () =>
      messagesService.getMessages({
        page,
        pageSize: 15,
        search: debouncedSearch || undefined,
        status,
      }),
  })

  const items = data?.items ?? []

  const markRead = useMutation({
    mutationFn: (id: string) => messagesService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", "staff"] })
    },
  })

  const reply = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      messagesService.reply(id, text),
    onSuccess: () => {
      toast.success("Reply sent")
      setExpanded(null)
      queryClient.invalidateQueries({ queryKey: ["messages", "staff"] })
    },
    onError: (error) => {
      toast.error("Couldn't send reply", {
        description: getErrorMessage(error),
      })
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Questions sent in by customers. Reply to respond by email.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search subject, email or ticket…"
            aria-label="Search messages"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {statusTabs.map((tab) => (
            <Button
              key={tab.value}
              type="button"
              variant={status === tab.value ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setStatus(tab.value)
                setPage(1)
              }}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <TableEmpty
            icon={InboxIcon}
            title="No messages"
            description="Customer messages will appear here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="hidden md:table-cell">Ticket</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((message) => (
                <React.Fragment key={message.id}>
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => {
                      const next = expanded === message.id ? null : message.id
                      setExpanded(next)
                      if (next && message.status === "new") {
                        markRead.mutate(message.id)
                      }
                    }}
                  >
                    <TableCell>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{message.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {message.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="line-clamp-1 text-sm">{message.subject}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="font-mono text-xs text-muted-foreground">
                        {message.ticket}
                      </span>
                    </TableCell>
                    <TableCell>
                      <MessageStatusBadge status={message.status} />
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(message.createdAt)}
                      </span>
                    </TableCell>
                  </TableRow>
                  {expanded === message.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-muted/30">
                        <MessageThread messageId={message.id} onReply={reply.mutate} replying={reply.isPending} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

function MessageThread({
  messageId,
  onReply,
  replying,
}: {
  messageId: string
  onReply: (input: { id: string; text: string }) => void
  replying: boolean
}) {
  const { data: message, isLoading } = useQuery({
    queryKey: ["message", "staff", messageId],
    queryFn: () => messagesService.getMessage(messageId),
  })
  const [replyText, setReplyText] = React.useState("")

  if (isLoading) {
    return <Skeleton className="h-40 rounded-xl" />
  }

  if (!message) {
    return null
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="min-w-0 rounded-xl border border-border bg-background p-4">
        <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {message.subject}
        </p>
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {message.message}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Badge variant="neutral">{message.ticket}</Badge>
          <span className="text-xs text-muted-foreground">
            {formatDate(message.createdAt)}
          </span>
        </div>
        {message.adminReply && (
          <div className="mt-4 rounded-xl border border-brand/25 bg-brand/5 p-4">
            <p className="mb-1 text-xs font-semibold tracking-wide text-brand uppercase">
              Your reply
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {message.adminReply}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
        <label
          htmlFor="reply"
          className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        >
          Reply to {message.email}
        </label>
        <Textarea
          id="reply"
          value={replyText}
          onChange={(event) => setReplyText(event.target.value)}
          placeholder="Write your response…"
          rows={5}
          className="flex-1 resize-none"
        />
        <Button
          type="button"
          onClick={() => {
            if (replyText.trim()) {
              onReply({ id: messageId, text: replyText.trim() })
            }
          }}
          disabled={replying || !replyText.trim()}
          className={cn("self-end")}
        >
          <SendIcon className="size-4" />
          {replying ? "Sending…" : "Send reply"}
        </Button>
      </div>
    </div>
  )
}

export { SupportMessagesView }
