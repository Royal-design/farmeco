"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { PencilIcon, PlusIcon, TagsIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"

import type { Category } from "@/types/catalog"
import { categoriesService } from "@/services/categories.service"
import { getErrorMessage } from "@/lib/errors"
import { PageHeader } from "@/features/admin/components/page-header"
import { CategoryForm } from "@/features/admin/components/category-form"
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Category | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories", "all", "newest"],
    queryFn: () => categoriesService.getCategoriesSorted("newest"),
  })

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditing(category)
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }
    setDeleting(true)
    try {
      await categoriesService.deleteCategory(deleteTarget.id)
      toast.success("Category deleted")
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    } catch (error) {
      toast.error("Couldn't delete category", {
        description: getErrorMessage(error),
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Categories"
        description="Organise products across the marketplace."
        actions={
          <Button onClick={openCreate}>
            <PlusIcon />
            Add category
          </Button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : !categories?.length ? (
          <TableEmpty
            icon={TagsIcon}
            title="No categories yet"
            description="Create your first category to organise products."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Slug</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="hidden sm:table-cell">Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
                        {category.emoji || "🏷️"}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {category.name}
                        </p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {category.shortDescription}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {category.slug}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm tabular-nums">
                      {category.productCount}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {category.featured ? (
                      <Badge variant="brand">Featured</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(category)}
                        aria-label={`Edit ${category.name}`}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(category)}
                        aria-label={`Delete ${category.name}`}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
          </DialogHeader>
          <CategoryForm
            initial={editing}
            onSuccess={() => {
              setDialogOpen(false)
              queryClient.invalidateQueries({ queryKey: ["categories"] })
            }}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this category?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be removed. Categories with products can't be deleted.`
            : undefined
        }
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export { AdminCategoriesPage }
