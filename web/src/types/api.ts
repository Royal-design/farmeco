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
