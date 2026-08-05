export interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface QueryParams {
  page?: number
  pageSize?: number
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

export interface ApiMeta {
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data?: T
  meta?: ApiMeta | null
  error_code?: string | null
}

export interface ApiResult<T> {
  data: T
  meta?: ApiMeta | null
  message?: string
}

export function toPaginated<T>(items: T[], meta?: ApiMeta | null): Paginated<T> {
  return {
    items,
    page: meta?.page ?? 1,
    pageSize: meta?.page_size ?? items.length,
    total: meta?.total ?? items.length,
    totalPages: meta?.total_pages ?? Math.max(1, Math.ceil((meta?.total ?? items.length) / Math.max(1, meta?.page_size ?? items.length))),
  }
}
