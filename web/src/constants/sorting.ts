export const sortOptions = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
] as const

export const pageSizes = [12, 24, 48] as const

export const priceBounds = { min: 0, max: 2500000, step: 50000 }
