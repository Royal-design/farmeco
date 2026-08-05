"use client"

import * as React from "react"
import { ImagePlusIcon, LinkIcon, LoaderIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

import { productsService } from "@/services/products.service"
import { getErrorMessage } from "@/lib/errors"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function ImageUploader({
  images,
  onChange,
}: {
  images: string[]
  onChange: (images: string[]) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)
  const [url, setUrl] = React.useState("")

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) {
      return
    }
    setUploading(true)
    try {
      const urls = await productsService.uploadImages(Array.from(files))
      onChange([...images, ...urls])
    } catch (error) {
      toast.error("Couldn't upload images", {
        description: getErrorMessage(error),
      })
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  const handleAddUrl = () => {
    const value = url.trim()
    if (!value) {
      return
    }
    if (!/^(https?:\/\/|data:image\/)/i.test(value)) {
      toast.error("Enter a valid image link", {
        description: "Links must start with http:// or https://",
      })
      return
    }
    if (images.includes(value)) {
      toast.error("That image is already added")
      return
    }
    onChange([...images, value])
    setUrl("")
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <div className="flex flex-wrap items-start gap-3">
        {images.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
          >
            <img src={src} alt="" className="size-full object-cover" />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange(images.filter((_, j) => j !== index))}
              className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
            >
              <XIcon className="size-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex size-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground disabled:opacity-50"
        >
          {uploading ? (
            <LoaderIcon className="size-4 animate-spin" />
          ) : (
            <ImagePlusIcon className="size-4" />
          )}
          Upload
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              handleAddUrl()
            }
          }}
          placeholder="Or paste an image link (https://…)"
          aria-label="Image link"
          className="h-9"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={handleAddUrl}
        >
          <LinkIcon className="size-3.5" />
          Add link
        </Button>
      </div>

      {images.length > 0 && (
        <Button
          variant="ghost"
          size="xs"
          className="w-fit text-muted-foreground"
          onClick={() => onChange([])}
        >
          Remove all
        </Button>
      )}
    </div>
  )
}

export { ImageUploader }
