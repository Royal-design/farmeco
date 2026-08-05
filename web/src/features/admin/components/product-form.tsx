"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { badgeMeta } from "@/constants/order"
import { ImageUploader } from "@/features/admin/components/image-upload"
import { badgeOptions } from "@/features/marketplace/types"
import { getErrorMessage } from "@/lib/errors"
import { cn } from "@/lib/utils"
import { productSchema } from "@/schemas/content.schema"
import { categoriesService } from "@/services/categories.service"
import type { ProductStatus } from "@/services/products.service"
import { productsService } from "@/services/products.service"
import type { Product, ProductBadge } from "@/types/catalog"

const statusOptions: Array<{ value: ProductStatus; label: string }> = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
]

type ProductFormInput = z.input<typeof productSchema>

function ProductForm({
  product,
  backHref = "/admin/products",
}: {
  product?: Product | null
  backHref?: string
}) {
  const router = useRouter()
  const isEdit = Boolean(product)

  const [badges, setBadges] = React.useState<ProductBadge[]>(product?.badges ?? [])
  const [status, setStatus] = React.useState<ProductStatus>(
    product ? (product.status as ProductStatus) : "published"
  )
  const [images, setImages] = React.useState<string[]>(product?.images ?? [])

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoriesService.getCategories,
  })

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      categoryId: product?.categoryId ?? "",
      price: product?.price ?? "",
      compareAtPrice: product?.compareAtPrice,
      stock: product?.stock ?? 0,
      unit: product?.unit ?? "head",
      origin: product?.origin ?? "",
      tags: product?.tags.join(", ") ?? "",
    },
    mode: "onTouched",
  })

  const mutation = useMutation({
    mutationFn: (values: ProductFormInput) => {
      const payload = {
        name: values.name,
        shortDescription: values.shortDescription,
        description: values.description,
        categoryId: values.categoryId,
        price: Number(values.price),
        compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : undefined,
        stock: Number(values.stock),
        unit: values.unit,
        origin: values.origin || undefined,
        images,
        tags: values.tags
          ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
        badges,
        status,
      }
      return isEdit && product
        ? productsService.updateProduct(product.id, payload)
        : productsService.createProduct(payload)
    },
    onSuccess: () => {
      toast.success(isEdit ? "Product updated" : "Product created")
      router.push(backHref)
      router.refresh()
    },
    onError: (error) => {
      toast.error(isEdit ? "Couldn't update product" : "Couldn't create product", {
        description: getErrorMessage(error),
      })
    },
  })

  const toggleBadge = (badge: ProductBadge) => {
    setBadges((current) =>
      current.includes(badge)
        ? current.filter((item) => item !== badge)
        : [...current, badge]
    )
  }

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values))

  if (loadingCategories) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FieldSet className="gap-5">
        <FieldLegend className="font-heading text-lg font-medium">Details</FieldLegend>
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="product-name">Product name</FieldLabel>
              <Input id="product-name" aria-invalid={!!form.formState.errors.name} {...field} />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="product-category">Category</FieldLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  items={categories?.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                >
                  <SelectTrigger id="product-category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[form.formState.errors.categoryId]} />
              </Field>
            )}
          />
          <Controller
            name="unit"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="product-unit">Unit</FieldLabel>
                              <Input id="product-unit" aria-invalid={!!form.formState.errors.unit} {...field} />
                 <FieldDescription>head, bird, crate, bag…</FieldDescription>
                <FieldError errors={[form.formState.errors.unit]} />
              </Field>
            )}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Controller
            name="price"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="product-price">Price (₦)</FieldLabel>
                <Input
                  id="product-price"
                  type="number"
                  min={0}
                  step="any"
                  aria-invalid={!!form.formState.errors.price}
                  {...field}
                  value={(field.value ?? "") as string}
                />
                <FieldError errors={[form.formState.errors.price]} />
              </Field>
            )}
          />
          <Controller
            name="compareAtPrice"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="product-compare">Compare-at price</FieldLabel>
                <Input
                  id="product-compare"
                  type="number"
                  min={0}
                  step="any"
                  value={(field.value ?? "") as string}
                  onChange={(event) => field.onChange(event.target.value ? Number(event.target.value) : undefined)}
                />
                <FieldDescription>Original price for sales</FieldDescription>
                <FieldError errors={[form.formState.errors.compareAtPrice]} />
              </Field>
            )}
          />
          <Controller
            name="stock"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="product-stock">Stock</FieldLabel>
                <Input
                  id="product-stock"
                  type="number"
                  min={0}
                  aria-invalid={!!form.formState.errors.stock}
                  {...field}
                  value={(field.value ?? "") as string}
                />
                <FieldError errors={[form.formState.errors.stock]} />
              </Field>
            )}
          />
        </div>
        <Controller
          name="origin"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="product-origin">Origin</FieldLabel>
              <Input id="product-origin" placeholder="Karu, FCT" {...field} />
              <FieldError errors={[form.formState.errors.origin]} />
            </Field>
          )}
        />
        <Controller
          name="shortDescription"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="product-short">Short description</FieldLabel>
              <Textarea
                id="product-short"
                rows={2}
                aria-invalid={!!form.formState.errors.shortDescription}
                {...field}
              />
              <FieldError errors={[form.formState.errors.shortDescription]} />
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="product-description">Full description</FieldLabel>
              <Textarea
                id="product-description"
                rows={5}
                aria-invalid={!!form.formState.errors.description}
                {...field}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>
          )}
        />
        <Controller
          name="tags"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="product-tags">Tags</FieldLabel>
              <FieldDescription>Comma separated, e.g. cattle, heifer, vaccinated</FieldDescription>
              <Input id="product-tags" placeholder="cattle, heifer" {...field} />
              <FieldError errors={[form.formState.errors.tags]} />
            </Field>
          )}
        />
      </FieldSet>

      <FieldSet className="gap-4">
        <FieldLegend className="font-heading text-lg font-medium">Badges & status</FieldLegend>
        <div className="flex flex-wrap gap-2">
          {badgeOptions.map((option) => {
            const meta = badgeMeta[option.value]
            const active = badges.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleBadge(option.value)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border text-muted-foreground hover:border-brand/30 hover:text-foreground"
                )}
              >
                {meta?.label ?? option.label}
              </button>
            )
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          {statusOptions.map((option) => (
            <Badge
              key={option.value}
              variant={status === option.value ? "brand" : "outline"}
              className="cursor-pointer"
              onClick={() => setStatus(option.value)}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </FieldSet>

      <FieldSet className="gap-4">
        <FieldLegend className="font-heading text-lg font-medium">Images</FieldLegend>
        <ImageUploader images={images} onChange={setImages} />
      </FieldSet>

      <div className="flex flex-wrap items-center gap-3 border-t pt-5">
        <Button type="submit" size="lg" disabled={mutation.isPending || form.formState.isSubmitting}>
          {mutation.isPending
            ? "Saving…"
            : isEdit
              ? "Save changes"
              : "Create product"}
        </Button>
        <ButtonLink href={backHref} variant="outline" size="lg">
          Cancel
        </ButtonLink>
      </div>
    </form>
  )
}

export { ProductForm }
