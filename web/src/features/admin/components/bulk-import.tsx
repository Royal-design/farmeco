"use client"

import * as React from "react"
import { useMutation } from "@tanstack/react-query"
import { CheckCircleIcon, DownloadIcon, FileSpreadsheetIcon, LoaderIcon } from "lucide-react"
import { toast } from "sonner"

import type { BulkEntity, BulkImportReport } from "@/services/bulk-import.service"
import { bulkImportService } from "@/services/bulk-import.service"
import { getErrorMessage } from "@/lib/errors"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function BulkImport({ entity }: { entity: BulkEntity }) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [report, setReport] = React.useState<BulkImportReport | null>(null)

  const mutation = useMutation({
    mutationFn: (file: File) => bulkImportService.importFile(entity, file),
    onSuccess: (result) => {
      setReport(result)
      if (result.failed === 0) {
        toast.success(`Imported ${result.imported} of ${result.total} rows`)
      } else {
        toast.warning(`Imported ${result.imported}, ${result.failed} row(s) skipped`)
      }
    },
    onError: (error) => {
      toast.error("Import failed", {
        description: getErrorMessage(error),
      })
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      mutation.mutate(file)
    }
    event.target.value = ""
  }

  const handleDownloadTemplate = async () => {
    try {
      await bulkImportService.downloadTemplate(entity)
    } catch (error) {
      toast.error("Couldn't download template", {
        description: getErrorMessage(error),
      })
    }
  }

  const visibleErrors = report?.errors ?? []

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
          <DownloadIcon />
          Template
        </Button>
        <Button
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            <FileSpreadsheetIcon />
          )}
          {mutation.isPending ? "Importing…" : "Bulk import"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <Dialog open={Boolean(report)} onOpenChange={(open) => !open && setReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import results</DialogTitle>
            <DialogDescription>
              {report
                ? `${report.imported} of ${report.total} rows imported${
                    report.failed > 0 ? `, ${report.failed} skipped` : ""
                  }.`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {visibleErrors.length > 0 ? (
            <div className="flex max-h-64 flex-col gap-1.5 overflow-y-auto">
              {visibleErrors.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs"
                >
                  <span className="font-semibold">Row {item.row}</span>
                  <span className="text-muted-foreground"> — {item.error}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm">
              <CheckCircleIcon className="size-4 text-brand" />
              All rows imported successfully.
            </div>
          )}

          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </>
  )
}

export { BulkImport }
