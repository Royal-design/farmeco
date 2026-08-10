import { api, http } from "@/lib/http"

export type BulkEntity = "products" | "categories" | "coupons" | "blog-posts"

export interface BulkImportErrorItem {
  row: number
  error: string
}

export interface BulkImportReport {
  total: number
  imported: number
  failed: number
  errors: BulkImportErrorItem[]
}

export const bulkImportService = {
  async importFile(entity: BulkEntity, file: File): Promise<BulkImportReport> {
    const formData = new FormData()
    formData.append("file", file)
    const { data } = await api.post<BulkImportReport>(`/bulk/import/${entity}`, formData)
    return data
  },

  async downloadTemplate(entity: BulkEntity): Promise<void> {
    const response = await http.get<Blob>(`/bulk/templates/${entity}`, {
      responseType: "blob",
    })
    const url = URL.createObjectURL(response.data)
    const link = document.createElement("a")
    link.href = url
    link.download = `${entity}-template.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },
}
