export interface BlogAuthor {
  name: string
  role: string
  avatar: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string[]
  coverImage: string
  category: string
  author: BlogAuthor
  publishedAt: string
  readTime: number
  tags: string[]
  featured?: boolean
}
