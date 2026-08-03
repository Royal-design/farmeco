"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, ClockIcon } from "lucide-react"

import type { BlogPost } from "@/types/blog"
import { formatDate } from "@/utils/format"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"

interface BlogCardProps {
  post: BlogPost
  className?: string
}

function BlogCard({ post, className }: BlogCardProps) {
  return (
    <article
      className={
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-lift " +
        (className ?? "")
      }
    >
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-muted"
        aria-label={post.title}
      >
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute top-3 left-3">
          <Badge variant="brand" className="bg-background/85 text-foreground ring-0 backdrop-blur dark:bg-background/85 dark:text-foreground">
            {post.category}
          </Badge>
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-heading line-clamp-2 text-lg font-medium leading-snug transition-colors group-hover:text-brand">
            {post.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <div className="flex items-center gap-2.5">
            <Avatar src={post.author.avatar} name={post.author.name} size="xs" />
            <span className="flex flex-col leading-tight">
              <span className="text-xs font-medium">{post.author.name}</span>
              <span className="text-[0.68rem] text-muted-foreground">
                {formatDate(post.publishedAt)}
              </span>
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ClockIcon className="size-3" />
            {post.readTime} min
          </span>
        </div>
      </div>
    </article>
  )
}

export { BlogCard }
