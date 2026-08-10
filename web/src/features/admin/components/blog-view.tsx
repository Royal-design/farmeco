"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FileTextIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"

import type { BlogPost } from "@/types/blog"
import { blogService } from "@/services/blog.service"
import { getErrorMessage } from "@/lib/errors"
import { formatDate } from "@/utils/format"
import { PageHeader } from "@/features/admin/components/page-header"
import { BulkImport } from "@/features/admin/components/bulk-import"
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
import { Badge } from "@/components/ui/badge"
import { Button, ButtonLink } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"

function AdminBlogPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = React.useState(1)
  const [deleteTarget, setDeleteTarget] = React.useState<BlogPost | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["posts", "admin", page],
    queryFn: () => blogService.getPosts({ page, pageSize: 12 }),
  })

  const items = data?.items ?? []

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }
    setDeleting(true)
    try {
      await blogService.deletePost(deleteTarget.id)
      toast.success("Post deleted")
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    } catch (error) {
      toast.error("Couldn't delete post", {
        description: getErrorMessage(error),
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Blog"
        description="Write guides and news for the Farmeco community."
        actions={
          <>
            <BulkImport entity="blog-posts" />
            <ButtonLink href="/admin/blog/new">
              <PlusIcon />
              New post
            </ButtonLink>
          </>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <TableEmpty
            icon={FileTextIcon}
            title="No posts yet"
            description="Share your first guide with the community."
            actionHref="/admin/blog/new"
            actionLabel="New post"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Featured</TableHead>
                <TableHead className="hidden lg:table-cell">Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : null}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="line-clamp-1 text-sm font-medium hover:text-brand"
                        >
                          {post.title}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">
                          {post.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {post.category}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {post.featured ? (
                      <Badge variant="brand">Featured</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(post.publishedAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <ButtonLink
                        href={`/admin/blog/${post.id}/edit`}
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${post.title}`}
                      >
                        <PencilIcon />
                      </ButtonLink>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(post)}
                        aria-label={`Delete ${post.title}`}
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

      {data && data.totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this post?"
        description={
          deleteTarget ? `"${deleteTarget.title}" will be permanently removed.` : undefined
        }
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export { AdminBlogPage }
