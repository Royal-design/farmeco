import { PageHeader } from "@/features/admin/components/page-header"
import { BlogForm } from "@/features/admin/components/blog-form"

export default function AdminNewBlogPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New post" description="Write a guide for the community." />
      <BlogForm />
    </div>
  )
}
