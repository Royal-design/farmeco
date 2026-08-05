import { BlogEditView } from "@/features/admin/components/blog-edit-view"

export default async function AdminEditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <BlogEditView postId={id} />
}
