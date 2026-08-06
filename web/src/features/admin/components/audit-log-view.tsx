"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { SearchIcon, ScrollTextIcon } from "lucide-react"

import type { AuditAction, AuditLogEntry } from "@/services/audit.service"
import { auditService } from "@/services/audit.service"
import { formatDate } from "@/utils/format"
import { useDebounce } from "@/hooks/use-debounce"
import { PageHeader } from "@/features/admin/components/page-header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/admin/components/table"
import { TableEmpty } from "@/features/admin/components/table-empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const resourceTypes = ["product", "category", "order", "user", "coupon"]

const actionMeta: Record<AuditAction, { label: string; tone: "success" | "info" | "danger" | "warning" }> = {
  CREATE: { label: "Create", tone: "success" },
  UPDATE: { label: "Update", tone: "info" },
  DELETE: { label: "Delete", tone: "danger" },
  STATUS_CHANGE: { label: "Status", tone: "warning" },
}

const actionOptions: Array<{ value: AuditAction; label: string }> = [
  { value: "CREATE", label: "Create" },
  { value: "UPDATE", label: "Update" },
  { value: "DELETE", label: "Delete" },
  { value: "STATUS_CHANGE", label: "Status change" },
]

function AuditLogView() {
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [resourceType, setResourceType] = React.useState("all")
  const [action, setAction] = React.useState<"all" | AuditAction>("all")
  const [expanded, setExpanded] = React.useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 350)

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", page, debouncedSearch, resourceType, action],
    queryFn: () =>
      auditService.getLogs({
        page,
        pageSize: 15,
        search: debouncedSearch || undefined,
        resourceType: resourceType === "all" ? undefined : resourceType,
        action: action === "all" ? undefined : action,
      }),
  })

  const items = data?.items ?? []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Audit log"
        description="A trail of admin and staff actions across the platform."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search summary or email…"
            aria-label="Search audit log"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={resourceType}
            onValueChange={(value) => {
              setResourceType(value ?? "all")
              setPage(1)
            }}
          >
            <SelectTrigger size="sm" className="w-40 capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All resources</SelectItem>
              {resourceTypes.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={action}
            onValueChange={(value) => {
              setAction((value ?? "all") as "all" | AuditAction)
              setPage(1)
            }}
          >
            <SelectTrigger size="sm" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {actionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            icon={ScrollTextIcon}
            title="No audit entries"
            description="Actions taken by admins and staff will appear here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="hidden md:table-cell">Resource</TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((entry) => (
                <React.Fragment key={entry.id}>
                  <TableRow
                    className="cursor-pointer"
                    onClick={() =>
                      setExpanded(expanded === entry.id ? null : entry.id)
                    }
                  >
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(entry.createdAt, "en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {entry.actorEmail ?? "System"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={actionMeta[entry.action].tone}>
                        {actionMeta[entry.action].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden capitalize md:table-cell">
                      <span className="text-sm">{entry.resourceType}</span>
                    </TableCell>
                    <TableCell>
                      <span className="line-clamp-2 text-sm">{entry.summary}</span>
                    </TableCell>
                  </TableRow>
                  {expanded === entry.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-muted/30">
                        <AuditDetails entry={entry} />
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

function AuditDetails({ entry }: { entry: AuditLogEntry }) {
  return (
    <div className="grid gap-3 text-sm sm:grid-cols-2">
      <div className="min-w-0">
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          Resource
        </p>
        <p className="break-all font-mono text-xs">
          {entry.resourceType}
          {entry.resourceId ? ` · ${entry.resourceId}` : ""}
        </p>
      </div>
      {entry.ipAddress && (
        <div className="min-w-0">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            IP address
          </p>
          <p className="break-all font-mono text-xs">{entry.ipAddress}</p>
        </div>
      )}
      {entry.afterData && (
        <div className="min-w-0 sm:col-span-2">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Data after
          </p>
          <JsonPreview value={entry.afterData} />
        </div>
      )}
      {entry.beforeData && (
        <div className="min-w-0 sm:col-span-2">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Data before
          </p>
          <JsonPreview value={entry.beforeData} />
        </div>
      )}
    </div>
  )
}

function JsonPreview({ value }: { value: Record<string, unknown> }) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs leading-relaxed",
        "text-muted-foreground"
      )}
    >
      {JSON.stringify(value, null, 2)}
    </pre>
  )
}

export { AuditLogView }
