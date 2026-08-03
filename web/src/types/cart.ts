export interface CartItem {
  productId: string
  slug: string
  name: string
  image: string
  price: number
  compareAtPrice?: number
  unit: string
  quantity: number
  stock: number
}
