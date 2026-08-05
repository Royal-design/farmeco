"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { categorySchema, type CategoryFormValues } from "@/schemas/content.schema"
import type { Category } from "@/types/catalog"
import { categoriesService } from "@/services/categories.service"
import { getErrorMessage } from "@/lib/errors"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageUploader } from "@/features/admin/components/image-upload"

interface CategoryFormProps {
  initial?: Category | null
  onSuccess?: () => void
  onCancel?: () => void
}

function CategoryForm({ initial, onSuccess, onCancel }: CategoryFormProps) {
  const [featured, setFeatured] = React.useState(initial?.featured ?? false)
  const [emoji, setEmoji] = React.useState(initial?.emoji ?? "")
  const [image, setImage] = React.useState(initial?.image ?? "")

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      shortDescription: initial?.shortDescription ?? "",
      description: initial?.description ?? "",
    },
  })

  const mutation = useMutation({
    mutationFn: (values: CategoryFormValues) => {
      const payload = {
        ...values,
        slug: values.slug || undefined,
        image: image || undefined,
        emoji: emoji || undefined,
        featured,
      }
      return initial
        ? categoriesService.updateCategory(initial.id, payload)
        : categoriesService.createCategory(payload)
    },
    onSuccess: () => {
      toast.success(initial ? "Category updated" : "Category created")
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(initial ? "Couldn't update category" : "Couldn't create category", {
        description: getErrorMessage(error),
      })
    },
  })

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values))

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="cat-name">Name</FieldLabel>
              <Input id="cat-name" aria-invalid={!!form.formState.errors.name} {...field} />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
          )}
        />
        <Controller
          name="slug"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="cat-slug">Slug</FieldLabel>
              <FieldError errors={[form.formState.errors.slug]} />
              <Input id="cat-slug" placeholder="auto-generated" {...field} />
            </Field>
          )}
        />
      </div>
      <Controller
        name="shortDescription"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="cat-short">Short description</FieldLabel>
            <Textarea id="cat-short" rows={2} aria-invalid={!!form.formState.errors.shortDescription} {...field} />
            <FieldError errors={[form.formState.errors.shortDescription]} />
          </Field>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="cat-description">Description</FieldLabel>
            <Textarea id="cat-description" rows={3} aria-invalid={!!form.formState.errors.description} {...field} />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>
        )}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="cat-emoji">Emoji</FieldLabel>
          <Input
            id="cat-emoji"
            value={emoji}
            onChange={(event) => setEmoji(event.target.value)}
            placeholder="🐄"
          />
        </Field>
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 px-3.5 py-2.5">
          <div>
            <p className="text-sm font-medium">Featured</p>
            <p className="text-xs text-muted-foreground">Show on the homepage</p>
          </div>
          <Switch
            checked={featured}
            onCheckedChange={setFeatured}
            aria-label="Featured category"
          />
        </div>
      </div>
      <Field>
        <FieldLabel>Image</FieldLabel>
        <ImageUploader
          images={image ? [image] : []}
          onChange={(images) => setImage(images[0] ?? "")}
        />
      </Field>
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : initial ? "Save changes" : "Create category"}
        </Button>
      </div>
    </form>
  )
}

export { CategoryForm }
