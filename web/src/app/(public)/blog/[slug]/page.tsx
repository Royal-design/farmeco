import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import { blogService } from "@/services/blog.service"
import { siteConfig } from "@/config/site"
import { formatDate } from "@/utils/format"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { GradientOrb } from "@/components/shared/gradient-orb"
import { NewsletterForm } from "@/features/newsletter/components/newsletter-form"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const posts = await blogService.getPosts({ pageSize: 100 })
    return posts.items.map((post) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await blogService.getPost(slug)
  if (!post) {
    return { title: "Article not found" }
  }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await blogService.getPost(slug)

  if (!post) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="relative">
        <div className="relative overflow-hidden border-b bg-gradient-to-b from-brand/[0.06] to-background">
          <GradientOrb variant="honey" className="top-10 right-[10%] opacity-40" />
          <div className="relative mx-auto max-w-3xl px-5 pt-8 pb-12 sm:px-8">
            <Breadcrumb
              className="mb-6"
              items={[{ label: "Blog", href: "/blog" }, { label: post.category }]}
            />
            <Badge variant="brand">{post.category}</Badge>
            <h1 className="mt-4 font-heading text-3xl font-medium leading-tight tracking-tight text-balance sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="mt-8 flex items-center gap-3 border-t pt-6">
              <Avatar src={post.author.avatar} name={post.author.name} size="md" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{post.author.name}</span>
                <span className="text-xs text-muted-foreground">
                  {post.author.role}
                </span>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">
                {formatDate(post.publishedAt)} · {post.readTime} min read
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1600}
              height={800}
              priority
              className="mb-10 aspect-[16/8] w-full rounded-3xl border border-border object-cover shadow-lift"
            />
          ) : null}
          <div className="flex flex-col gap-6">
            {post.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-base leading-[1.85] text-foreground/85"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
            <h2 className="font-heading text-xl font-medium">
              Fresh farm insights every week
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Join 24,000+ farmers getting practical livestock advice and the
              best listings — no spam, ever.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </article>
    </>
  )
}
