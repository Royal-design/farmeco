import axios, { AxiosError, type AxiosRequestConfig } from "axios"

import {
  clearStoredSession,
  getStoredTokens,
  updateStoredTokens,
} from "@/lib/session"
import type { ApiEnvelope, ApiError, ApiResult } from "@/types/api"

const API_BASE = process.env.NEXT_PUBLIC_API_URL

const http = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  paramsSerializer: {
    serialize(params) {
      const searchParams = new URLSearchParams()
      Object.entries(params ?? {}).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          return
        }
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item !== null && item !== undefined && item !== "") {
              searchParams.append(key, String(item))
            }
          })
        } else {
          searchParams.append(key, String(value))
        }
      })
      return searchParams.toString()
    },
  },
})

http.interceptors.request.use((config) => {
  const { accessToken } = getStoredTokens()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = getStoredTokens()
  if (!refreshToken) {
    return null
  }
  try {
    const { data } = await axios.post<ApiEnvelope<{
      access_token: string
      refresh_token: string
    }>>(
      `${API_BASE}/auth/refresh`,
      { refresh_token: refreshToken }
    )
    const payload = data.data
    if (!payload) {
      clearStoredSession()
      return null
    }
    updateStoredTokens(payload.access_token, payload.refresh_token)
    return payload.access_token
  } catch {
    clearStoredSession()
    return null
  }
}

function toApiError(error: AxiosError<ApiEnvelope<unknown>>): ApiError {
  const payload = error.response?.data
  return {
    code:
      payload?.error_code ??
      (error.response?.status ? `HTTP_${error.response.status}` : "NETWORK_ERROR"),
    message:
      payload?.message ??
      error.response?.statusText ??
      error.message ??
      "Something went wrong",
  }
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined
    const status = error.response?.status

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/")
    ) {
      original._retry = true
      const token = await refreshAccessToken()
      if (token) {
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${token}`,
        }
        return http(original)
      }
    }

    throw toApiError(error)
  }
)

async function request<T>(config: AxiosRequestConfig): Promise<ApiResult<T>> {
  const response = await http.request<ApiEnvelope<T> | T>(config)
  const payload = response.data as ApiEnvelope<T>

  if (payload && typeof payload === "object" && "success" in payload) {
    return {
      data: payload.data as T,
      meta: payload.meta ?? undefined,
      message: payload.message,
    }
  }

  return { data: payload as T }
}

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    request<T>({ method: "GET", url, params }),
  post: <T>(url: string, body?: unknown) =>
    request<T>({ method: "POST", url, data: body }),
  put: <T>(url: string, body?: unknown) =>
    request<T>({ method: "PUT", url, data: body }),
  patch: <T>(url: string, body?: unknown) =>
    request<T>({ method: "PATCH", url, data: body }),
  delete: <T>(url: string) => request<T>({ method: "DELETE", url }),
  upload: <T>(url: string, formData: FormData) =>
    request<T>({ method: "POST", url, data: formData }),
}
