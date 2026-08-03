import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { productsService } from "@/services/products.service"
import { categoriesService } from "@/services/categories.service"
import { ProductDetailView } from "@/features/product/components/product-detail-view"
import { siteConfig } from "@/config/site"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const products = await productsService.getProducts({ pageSize: 100 })
  return products.items.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await productsService.getProduct(slug)
  if (!product) {
    return { title: "Product not found" }
  }

  const url = `${siteConfig.url}/shop/${product.slug}`
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      type: "website",
      url,
      title: `${product.name} · ${siteConfig.name}`,
      description: product.shortDescription,
      images: [{ url: product.images[0], alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: [product.images[0]],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await productsService.getProduct(slug)

  if (!product) {
    notFound()
  }

  const category = await categoriesService.getCategoryById(product.categoryId)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: siteConfig.name },
    category: category?.name ?? "Livestock",
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/shop/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView slug={slug} initialProduct={product} />
    </>
  )
}
