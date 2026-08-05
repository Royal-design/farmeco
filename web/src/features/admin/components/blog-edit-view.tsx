"use client"

import { useQuery } from "@tanstack/react-query"
import { FileTextIcon } from "lucide-react"

import { blogService } from "@/services/blog.service"
import { PageHeader } from "@/features/admin/components/page-header"
import { BlogForm } from "@/features/admin/components/blog-form"
import { ButtonLink } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"

function BlogEditView({ postId }: { postId: string }) {
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => blogService.getPostById(postId),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  if (isError || !post) {
    return (
      <EmptyState
        icon={FileTextIcon}
        title="Post not found"
        description="This post may have been removed."
        action={<ButtonLink href="/admin/blog">Back to blog</ButtonLink>}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit post" description={post.title} />
      <BlogForm post={post} />
    </div>
  )
}

export { BlogEditView }
