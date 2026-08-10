"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button, ButtonLink } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "@/features/admin/components/image-upload"
import { getErrorMessage } from "@/lib/errors"
import { blogSchema, type BlogFormValues } from "@/schemas/content.schema"
import { blogService } from "@/services/blog.service"
import type { BlogPost } from "@/types/blog"

function BlogForm({
  post,
  backHref = "/admin/blog",
}: {
  post?: BlogPost | null
  backHref?: string
}) {
  const router = useRouter()
  const isEdit = Boolean(post)
  const [featured, setFeatured] = React.useState(post?.featured ?? false)
  const [coverImages, setCoverImages] = React.useState<string[]>(
    post?.coverImage ? [post.coverImage] : []
  )

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: post?.title ?? "",
      excerpt: post?.excerpt ?? "",
      category: post?.category ?? "",
      tags: post?.tags.join(", ") ?? "",
      content: post?.content.join("\n\n") ?? "",
      coverImage: post?.coverImage ?? "",
    },
    mode: "onTouched",
  })

  const mutation = useMutation({
    mutationFn: (values: BlogFormValues) => {
      const paragraphs = values.content
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)

      const payload = {
        title: values.title,
        excerpt: values.excerpt,
        category: values.category,
        tags: values.tags
          ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
        content: paragraphs,
        featured,
        coverImage: coverImages[0] ?? undefined,
        images: coverImages,
      }

      return isEdit && post
        ? blogService.updatePost(post.id, payload)
        : blogService.createPost(payload)
    },
    onSuccess: () => {
      toast.success(isEdit ? "Post updated" : "Post created")
      router.push(backHref)
      router.refresh()
    },
    onError: (error) => {
      toast.error(isEdit ? "Couldn't update post" : "Couldn't create post", {
        description: getErrorMessage(error),
      })
    },
  })

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values))

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FieldSet className="gap-5">
        <FieldLegend className="font-heading text-lg font-medium">Post</FieldLegend>
        <Controller
          name="title"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="blog-title">Title</FieldLabel>
              <Input id="blog-title" aria-invalid={!!form.formState.errors.title} {...field} />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="category"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="blog-category">Category</FieldLabel>
                <Input id="blog-category" placeholder="Buying Guide, Poultry…" aria-invalid={!!form.formState.errors.category} {...field} />
                <FieldError errors={[form.formState.errors.category]} />
              </Field>
            )}
          />
          <Controller
            name="tags"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="blog-tags">Tags</FieldLabel>
                <Input id="blog-tags" placeholder="cattle, health" {...field} />
                <FieldDescription>Comma separated</FieldDescription>
                <FieldError errors={[form.formState.errors.tags]} />
              </Field>
            )}
          />
        </div>
        <Controller
          name="excerpt"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="blog-excerpt">Excerpt</FieldLabel>
              <Textarea id="blog-excerpt" rows={2} aria-invalid={!!form.formState.errors.excerpt} {...field} />
              <FieldError errors={[form.formState.errors.excerpt]} />
            </Field>
          )}
        />
        <Controller
          name="content"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="blog-content">Content</FieldLabel>
              <FieldDescription>
                Separate paragraphs with a blank line. Reading time is estimated automatically.
              </FieldDescription>
              <Textarea id="blog-content" rows={12} aria-invalid={!!form.formState.errors.content} {...field} />
              <FieldError errors={[form.formState.errors.content]} />
            </Field>
          )}
        />
      </FieldSet>

      <FieldSet className="gap-4">
        <FieldLegend className="font-heading text-lg font-medium">Cover & visibility</FieldLegend>
        <ImageUploader images={coverImages} onChange={setCoverImages} />
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 px-3.5 py-2.5">
          <div>
            <p className="text-sm font-medium">Featured post</p>
            <p className="text-xs text-muted-foreground">Highlight on the blog homepage</p>
          </div>
          <Switch checked={featured} onCheckedChange={setFeatured} aria-label="Featured post" />
        </div>
      </FieldSet>

      <div className="flex flex-wrap items-center gap-3 border-t pt-5">
        <Button type="submit" size="lg" disabled={mutation.isPending || form.formState.isSubmitting}>
          {mutation.isPending ? "Saving…" : isEdit ? "Save changes" : "Publish post"}
        </Button>
        <ButtonLink href={backHref} variant="outline" size="lg">
          Cancel
        </ButtonLink>
      </div>
    </form>
  )
}

export { BlogForm }
