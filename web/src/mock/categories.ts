import type { Category } from "@/types/catalog"
import { CATEGORY_PALETTES, scene } from "@/mock/art"

function art(emoji: string, categoryKey: keyof typeof CATEGORY_PALETTES) {
  return scene(emoji, CATEGORY_PALETTES[categoryKey].base, "", false)
}

export const categories: Category[] = [
  {
    id: "cat-cattle",
    slug: "cattle",
    name: "Cattle",
    shortDescription: "Beef & dairy cattle from certified herds",
    description:
      "Health-checked beef and dairy cattle raised on pasture. Fully vaccinated, dewormed and ready to thrive on your farm.",
    emoji: "🐄",
    image: art("🐄", "cattle"),
    accent: "cattle",
    productCount: 18,
    featured: true,
  },
  {
    id: "cat-goats-sheep",
    slug: "goats-sheep",
    name: "Goats & Sheep",
    shortDescription: "Boer goats, dairy does & hardy sheep",
    description:
      "Boer goats, Kiko kids, dairy does and cold-hardy sheep breeds with full veterinary records and DNA testing.",
    emoji: "🐐",
    image: art("🐐", "goats-sheep"),
    accent: "goats-sheep",
    productCount: 14,
    featured: true,
  },
  {
    id: "cat-pigs",
    slug: "pigs",
    name: "Pigs",
    shortDescription: "Heritage & hybrid weaners",
    description:
      "Pasture-raised heritage and hybrid piglets, weaned and dewormed, from biosecure breeding programs.",
    emoji: "🐖",
    image: art("🐖", "pigs"),
    accent: "pigs",
    productCount: 9,
    featured: true,
  },
  {
    id: "cat-poultry",
    slug: "poultry",
    name: "Poultry",
    shortDescription: "Layers, broilers, turkeys & ducks",
    description:
      "Day-old chicks, pullets, broilers, turkeys, ducks and geese — vaccinated and hatchery certified.",
    emoji: "🐔",
    image: art("🐔", "poultry"),
    accent: "poultry",
    productCount: 22,
    featured: true,
  },
  {
    id: "cat-horses",
    slug: "horses",
    name: "Horses",
    shortDescription: "Working & leisure horses",
    description:
      "Gentle, trail-ready and working horses with sound vetting, farrier care and temperament testing.",
    emoji: "🐎",
    image: art("🐎", "horses"),
    accent: "horses",
    productCount: 6,
    featured: false,
  },
  {
    id: "cat-rabbits",
    slug: "rabbits",
    name: "Rabbits",
    shortDescription: "Meat & fancy breeds",
    description:
      "Healthy meat breeds like New Zealand and Californian, plus select fancy breeds for hobbyists.",
    emoji: "🐇",
    image: art("🐇", "rabbits"),
    accent: "rabbits",
    productCount: 8,
    featured: false,
  },
  {
    id: "cat-supplies",
    slug: "supplies",
    name: "Feed & Supplies",
    shortDescription: "Feed, health & farm essentials",
    description:
      "Quality feed, mineral supplements, fencing, waterers and veterinary essentials from trusted brands.",
    emoji: "🌾",
    image: art("🌾", "supplies"),
    accent: "supplies",
    productCount: 31,
    featured: false,
  },
  {
    id: "cat-eggs-dairy",
    slug: "eggs-dairy",
    name: "Eggs & Dairy",
    shortDescription: "Farm-fresh eggs & dairy",
    description:
      "Free-range eggs, raw and cultured dairy sourced daily from family farms within 40 km of you.",
    emoji: "🥚",
    image: art("🥚", "eggs-dairy"),
    accent: "eggs-dairy",
    productCount: 12,
    featured: false,
  },
]
