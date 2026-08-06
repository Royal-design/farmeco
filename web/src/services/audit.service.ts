import type { Paginated, QueryParams } from "@/types/api"
import { toPaginated } from "@/types/api"
import { api } from "@/lib/http"

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE"

export interface AuditLogEntry {
  id: string
  actorId: string | null
  actorEmail: string | null
  actorName: string | null
  action: AuditAction
  resourceType: string
  resourceId: string | null
  summary: string
  beforeData: Record<string, unknown> | null
  afterData: Record<string, unknown> | null
  ipAddress: string | null
  createdAt: string
}

interface RawAuditLog {
  id: string
  actor_id: string | null
  actor_email: string | null
  actor_name: string | null
  action: AuditAction
  resource_type: string
  resource_id: string | null
  summary: string
  before_data: Record<string, unknown> | null
  after_data: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export interface AuditLogsQuery extends QueryParams {
  resourceType?: string
  action?: AuditAction
  search?: string
}

function mapAuditLog(raw: RawAuditLog): AuditLogEntry {
  return {
    id: raw.id,
    actorId: raw.actor_id,
    actorEmail: raw.actor_email,
    actorName: raw.actor_name,
    action: raw.action,
    resourceType: raw.resource_type,
    resourceId: raw.resource_id,
    summary: raw.summary,
    beforeData: raw.before_data,
    afterData: raw.after_data,
    ipAddress: raw.ip_address,
    createdAt: raw.created_at,
  }
}

export const auditService = {
  async getLogs(params?: AuditLogsQuery): Promise<Paginated<AuditLogEntry>> {
    const { data, meta } = await api.get<RawAuditLog[]>("/audit-logs", {
      resource_type: params?.resourceType,
      action: params?.action,
      search: params?.search,
      page: params?.page,
      page_size: params?.pageSize,
    })
    return toPaginated(data.map(mapAuditLog), meta)
  },
}
