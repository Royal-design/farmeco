import type { Paginated, QueryParams } from "@/types/api"
import { paginate } from "@/utils/array"

export async function mockRequest<T>(data: T, ms = 280): Promise<T> {
  if (typeof window !== "undefined") {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
  return structuredClone(data)
}

export function paginateData<T>(items: T[], params?: QueryParams): Paginated<T> {
  const page = Number(params?.page) || 1
  const pageSize = Number(params?.pageSize) || 12
  return paginate(items, page, pageSize)
}
