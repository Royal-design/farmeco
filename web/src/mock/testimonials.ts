import type { Testimonial } from "@/types/catalog"
import { avatar } from "@/mock/art"

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "I found a healthy Boer buck within a week. The vet records were complete and the farm was transparent from the first message. Easily the best marketplace I've used for livestock.",
    author: "Marcus Bennett",
    role: "Smallholder, Iowa",
    avatar: avatar("#4d7c58", "#a8895b", "MB"),
    rating: 5,
  },
  {
    id: "t2",
    quote:
      "The A2/A2 Holstein I bought here is producing beautiful milk for our family. Delivery was smooth and the paperwork was ready before the truck arrived.",
    author: "Elena Voss",
    role: "Dairy family farm, Wisconsin",
    avatar: avatar("#3f7a82", "#8a5f99", "EV"),
    rating: 5,
  },
  {
    id: "t3",
    quote:
      "As a buyer I love the health certification on every listing. As a seller, the marketplace fees are the fairest I've seen. Both sides win.",
    author: "Jonas Keller",
    role: "Registered breeder, Texas",
    avatar: avatar("#c99a5b", "#4d7c58", "JK"),
    rating: 5,
  },
  {
    id: "t4",
    quote:
      "Ordered pullets at 9 pm and they arrived at the farm before noon the next day. Every single bird was bright-eyed and healthy.",
    author: "Priya Raghavan",
    role: "Backyard flock keeper, Georgia",
    avatar: avatar("#8a5f99", "#c99a5b", "PR"),
    rating: 4,
  },
  {
    id: "t5",
    quote:
      "The biosecurity checks and transport standards give me real confidence. I've shipped three orders and every buyer has been happy.",
    author: "Hannah Wu",
    role: "Poultry producer, Arkansas",
    avatar: avatar("#2f5d3f", "#3f7a82", "HW"),
    rating: 5,
  },
]
