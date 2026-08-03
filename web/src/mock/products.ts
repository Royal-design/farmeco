import type { Product, ProductReview } from "@/types/catalog"
import { productImages, type Palette } from "@/mock/art"
import { categories } from "@/mock/categories"

type CategoryKey =
  | "cattle"
  | "goats-sheep"
  | "pigs"
  | "poultry"
  | "horses"
  | "rabbits"
  | "supplies"
  | "eggs-dairy"

import { CATEGORY_PALETTES } from "@/mock/art"

function palettesFor(categoryKey: CategoryKey): {
  base: Palette
  view: Palette
  warm: Palette
} {
  return CATEGORY_PALETTES[categoryKey]
}

function imagesFor(categoryKey: CategoryKey, emoji: string, label?: string) {
  return productImages(emoji, palettesFor(categoryKey), label)
}

function categoryId(slug: string) {
  return categories.find((c) => c.slug === slug)?.id ?? categories[0].id
}

const reviews = {
  cattle: (): ProductReview[] => [
    {
      id: "r1",
      author: "Marcus B.",
      authorInitials: "MB",
      rating: 5,
      title: "Sturdy, calm and healthy",
      comment:
        "Arrived exactly as described — vet checked her the same day and everything was in order. Saddle-stock response from the seller was excellent.",
      date: "2026-07-02",
      helpfulCount: 12,
    },
    {
      id: "r2",
      author: "Priya R.",
      authorInitials: "PR",
      rating: 4,
      title: "Great animal, slightly delayed delivery",
      comment:
        "The heifer is beautiful and gentle. Delivery ran a day late due to transport but the team kept me updated the whole time.",
      date: "2026-06-14",
      helpfulCount: 5,
    },
  ],
  goat: (): ProductReview[] => [
    {
      id: "r3",
      author: "Jonas K.",
      authorInitials: "JK",
      rating: 5,
      title: "Exactly as pictured",
      comment:
        "Healthy, playful and fully vaccinated. Papers arrived in the same box as the transport. Would buy from this farm again.",
      date: "2026-06-28",
      helpfulCount: 8,
    },
    {
      id: "r4",
      author: "Amara T.",
      authorInitials: "AT",
      rating: 5,
      title: "Wonderful temperament",
      comment:
        "Our kids adore her. She settled into the herd in a week and the health records were thorough.",
      date: "2026-05-19",
      helpfulCount: 3,
    },
  ],
  pig: (): ProductReview[] => [
    {
      id: "r5",
      author: "Dimitri S.",
      authorInitials: "DS",
      rating: 5,
      title: "Vigorous weaners",
      comment:
        "Both piglets took to feed right away. Clean, well-socialised and dewormed as promised.",
      date: "2026-07-10",
      helpfulCount: 6,
    },
  ],
  poultry: (): ProductReview[] => [
    {
      id: "r6",
      author: "Hannah W.",
      authorInitials: "HW",
      rating: 5,
      title: "High hatch quality",
      comment:
        "All pullets arrived lively. The vaccination records are complete and they started laying right on schedule.",
      date: "2026-06-30",
      helpfulCount: 15,
    },
    {
      id: "r7",
      author: "Grayson M.",
      authorInitials: "GM",
      rating: 4,
      title: "Good birds, tough packaging",
      comment:
        "Birds are healthy and settled in well. The crate was a little cramped for the trip but no harm done.",
      date: "2026-05-22",
      helpfulCount: 4,
    },
  ],
  horse: (): ProductReview[] => [
    {
      id: "r8",
      author: "Elena V.",
      authorInitials: "EV",
      rating: 5,
      title: "A dream to ride",
      comment:
        "Sound, smooth gaits and a lovely temperament. The vetting report matched him perfectly.",
      date: "2026-06-05",
      helpfulCount: 9,
    },
  ],
  rabbit: (): ProductReview[] => [
    {
      id: "r9",
      author: "Omar F.",
      authorInitials: "OF",
      rating: 5,
      title: "Healthy trio",
      comment:
        "All three rabbits are calm, clean and eating well. Breed documentation was included.",
      date: "2026-07-18",
      helpfulCount: 2,
    },
  ],
  supply: (): ProductReview[] => [
    {
      id: "r10",
      author: "Sana P.",
      authorInitials: "SP",
      rating: 5,
      title: "Fresh batch, great price",
      comment:
        "Feed arrived fresh with a visible batch date. The flock has been thriving on it for a month.",
      date: "2026-07-08",
      helpfulCount: 11,
    },
  ],
  dairy: (): ProductReview[] => [
    {
      id: "r11",
      author: "Liam C.",
      authorInitials: "LC",
      rating: 5,
      title: "Farm fresh every week",
      comment:
        "The eggs are consistently gorgeous and the dairy is creamy. Delivery on Saturday like clockwork.",
      date: "2026-07-15",
      helpfulCount: 7,
    },
  ],
} as const

const reviewKeyMap: Record<CategoryKey, keyof typeof reviews> = {
  cattle: "cattle",
  "goats-sheep": "goat",
  pigs: "pig",
  poultry: "poultry",
  horses: "horse",
  rabbits: "rabbit",
  supplies: "supply",
  "eggs-dairy": "dairy",
}

function reviewKeyFor(categorySlug: CategoryKey): keyof typeof reviews {
  return reviewKeyMap[categorySlug]
}

interface ProductSeed {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  categorySlug: CategoryKey
  emoji: string
  price: number
  compareAtPrice?: number
  unit: string
  stock: number
  rating: number
  reviewCount: number
  badges: Product["badges"]
  origin: string
  farm: string
  sold: number
  createdAt: string
  specs: Product["specs"]
  tags: string[]
  imageLabel?: string
}

const seeds: ProductSeed[] = [
  {
    id: "p1",
    slug: "belted-galloway-heifer",
    name: "Belted Galloway Heifer",
    shortDescription: "19-month-old polled heifer, calm and pasture-raised",
    description:
      "A striking 19-month-old Belted Galloway heifer raised entirely on native pasture. Polled, dewormed and fully vaccinated against clostridial diseases. She has a quiet temperament, excellent frame and is ready to join your breeding program this season. Delivery available within 300 km with a livestock haulier.",
    categorySlug: "cattle",
    emoji: "🐮",
    price: 1950,
    unit: "head",
    stock: 3,
    rating: 4.9,
    reviewCount: 2,
    badges: ["featured", "organic"],
    origin: "Greenfield Valley, Iowa",
    farm: "Willow Creek Ranch",
    sold: 41,
    createdAt: "2026-07-12",
    specs: [
      { label: "Age", value: "19 months" },
      { label: "Weight", value: "≈ 410 kg" },
      { label: "Breed", value: "Belted Galloway" },
      { label: "Polled", value: "Yes" },
      { label: "Vaccination", value: "Clostridial + Lepto" },
    ],
    tags: ["heifer", "polled", "grass-fed", "breeding"],
    imageLabel: "HEIFER",
  },
  {
    id: "p2",
    slug: "holstein-dairy-cow-a2-a2",
    name: "Holstein Dairy Cow · A2/A2",
    shortDescription: "Second-lactation A2/A2 holstein, in calf for September",
    description:
      "A well-milked second-lactation Holstein confirmed A2/A2 for gentle, easy-digesting milk. She is in calf to a polled A2 bull and due in September. Current production holds at 28 L/day. Complete records, hoof-trim history and monthly test-day data are available on request.",
    categorySlug: "cattle",
    emoji: "🐄",
    price: 2400,
    unit: "head",
    stock: 2,
    rating: 4.8,
    reviewCount: 2,
    badges: ["certified", "featured"],
    origin: "Lakeside County, Wisconsin",
    farm: "Cedar Lane Dairy",
    sold: 27,
    createdAt: "2026-07-02",
    specs: [
      { label: "Lactation", value: "2nd" },
      { label: "Genetics", value: "A2/A2 confirmed" },
      { label: "Production", value: "28 L/day" },
      { label: "Due date", value: "Sept 2026" },
      { label: "Breeding", value: "Polled A2 AI" },
    ],
    tags: ["dairy", "a2", "in-calf", "polled"],
    imageLabel: "DAIRY",
  },
  {
    id: "p3",
    slug: "angus-cross-herd-bull",
    name: "Angus Cross Herd Bull",
    shortDescription: "2-year-old performance-tested Angus cross bull",
    description:
      "A 2-year-old performance-tested Angus cross bull with strong growth EPDs and sound structure. Semen-tested and vet-checked. He has been running with a small group of heifers for a month and displays excellent libido and calm handling manners.",
    categorySlug: "cattle",
    emoji: "🐂",
    price: 2850,
    compareAtPrice: 3100,
    unit: "head",
    stock: 1,
    rating: 4.7,
    reviewCount: 2,
    badges: ["sale", "certified"],
    origin: "Red Prairie, Kansas",
    farm: "Tallgrass Livestock",
    sold: 15,
    createdAt: "2026-06-25",
    specs: [
      { label: "Age", value: "24 months" },
      { label: "Semen test", value: "Passed" },
      { label: "Breed", value: "Angus Cross" },
      { label: "Birth weight", value: "32 kg" },
      { label: "Docility", value: "Excellent" },
    ],
    tags: ["bull", "breeding", "performance-tested"],
    imageLabel: "BULL",
  },
  {
    id: "p4",
    slug: "boer-goat-buck",
    name: "Boer Goat Buck",
    shortDescription: "Registered fullblood Boer buck, 14 months",
    description:
      "Registered fullblood Boer buck with outstanding muscle confirmation and a quiet, easy-going disposition. Fully vaccinated, CD/T boosted and free of CL/CAE. Suitable for breeding up to 30 does this season.",
    categorySlug: "goats-sheep",
    emoji: "🐐",
    price: 420,
    unit: "head",
    stock: 4,
    rating: 4.9,
    reviewCount: 2,
    badges: ["featured", "certified"],
    origin: "Hill County, Texas",
    farm: "Bluebonnet Goats",
    sold: 33,
    createdAt: "2026-07-14",
    specs: [
      { label: "Age", value: "14 months" },
      { label: "Registration", value: "Fullblood ABGA" },
      { label: "Health", value: "CL/CAE free" },
      { label: "Condition", value: "3.5/5 BCS" },
    ],
    tags: ["buck", "registered", "fullblood"],
    imageLabel: "BUCK",
  },
  {
    id: "p5",
    slug: "kiko-meat-goat-doe",
    name: "Kiko Meat Goat Doe",
    shortDescription: "2-year-old Kiko doe, exposed and kid-proven",
    description:
      "Kid-proven Kiko doe, parasite-resistant and self-sufficient on pasture. Exposed to a registered buck for fall kidding. Excellent mothering record, calm around children, and ready to upgrade any meat herd.",
    categorySlug: "goats-sheep",
    emoji: "🐐",
    price: 360,
    unit: "head",
    stock: 6,
    rating: 4.8,
    reviewCount: 2,
    badges: ["organic"],
    origin: "Hill County, Texas",
    farm: "Bluebonnet Goats",
    sold: 58,
    createdAt: "2026-06-18",
    specs: [
      { label: "Age", value: "2 years" },
      { label: "Kid record", value: "Twin kids 2x" },
      { label: "FAMACHA", value: "1 (healthy)" },
      { label: "Breeding", value: "Exposed for fall" },
    ],
    tags: ["doe", "kiko", "pasture-raised"],
    imageLabel: "DOE",
  },
  {
    id: "p6",
    slug: "suffolk-ewe-lambs",
    name: "Suffolk Ewe Lambs (Pair)",
    shortDescription: "Twin ewe lambs from a top dual-purpose flock",
    description:
      "A matched pair of twin Suffolk ewe lambs from a performance-recorded flock. Frame-scored, vaccinated and raised on clean pasture. Ideal for starting or upgrading a commercial flock.",
    categorySlug: "goats-sheep",
    emoji: "🐑",
    price: 310,
    unit: "pair",
    stock: 5,
    rating: 4.7,
    reviewCount: 1,
    badges: ["new"],
    origin: "Meadow Ridge, Ohio",
    farm: "Evergreen Flock",
    sold: 22,
    createdAt: "2026-07-20",
    specs: [
      { label: "Age", value: "5 months" },
      { label: "Breed", value: "Suffolk" },
      { label: "Vaccination", value: "CD/T + OPP" },
      { label: "Worming", value: "Clear on 3x FEC" },
    ],
    tags: ["ewe", "lamb", "suffolk"],
    imageLabel: "EWES",
  },
  {
    id: "p7",
    slug: "berkshire-weaners-pair",
    name: "Berkshire Weaners (Pair)",
    shortDescription: "8-week-old Berkshire weaners, biosecure origin",
    description:
      "Two healthy 8-week-old Berkshire weaners from a closed, biosecure herd. Weaned 3 weeks, castrated males, dewormed and started on creep feed. Marbling genetics ideal for smallholder pork production.",
    categorySlug: "pigs",
    emoji: "🐖",
    price: 480,
    unit: "pair",
    stock: 3,
    rating: 4.9,
    reviewCount: 1,
    badges: ["featured"],
    origin: "Riverbend, Missouri",
    farm: "Prairie Pork Co.",
    sold: 46,
    createdAt: "2026-07-05",
    specs: [
      { label: "Age", value: "8 weeks" },
      { label: "Breed", value: "Berkshire" },
      { label: "Castrated", value: "Yes" },
      { label: "Dewormed", value: "Fenbendazole" },
    ],
    tags: ["weaners", "berkshire", "smallholder"],
    imageLabel: "WEANERS",
  },
  {
    id: "p8",
    slug: "yorkshire-hampshire-cross-weaners",
    name: "Yorkshire × Hampshire Weaners (4)",
    shortDescription: "Fast-growing cross weaners, all docs included",
    description:
      "Four vigorous Yorkshire × Hampshire cross weaners with excellent growth genetics and quiet temperament. Fully vaccinated, ironed and dewormed. Ideal for finishing within 5–6 months.",
    categorySlug: "pigs",
    emoji: "🐖",
    price: 520,
    unit: "set",
    stock: 2,
    rating: 4.6,
    reviewCount: 0,
    badges: ["best-seller"],
    origin: "Riverbend, Missouri",
    farm: "Prairie Pork Co.",
    sold: 64,
    createdAt: "2026-06-30",
    specs: [
      { label: "Age", value: "7 weeks" },
      { label: "Breed", value: "Y×H cross" },
      { label: "Vaccination", value: "Mycoplasma + Circovirus" },
      { label: "Avg. weight", value: "14 kg" },
    ],
    tags: ["weaners", "cross", "finishing"],
    imageLabel: "PIGLETS",
  },
  {
    id: "p9",
    slug: "isa-brown-pullets",
    name: "ISA Brown Pullets",
    shortDescription: "16-week vaccinated pullets, ready to lay",
    description:
      "Premium ISA Brown pullets at 16 weeks, vaccinated for Marek's, IB, ND and Gumboro. Started on layer ration and already pecking at nest boxes. Expect 300+ eggs a year from these hardy layers.",
    categorySlug: "poultry",
    emoji: "🐔",
    price: 180,
    unit: "pack of 10",
    stock: 12,
    rating: 4.9,
    reviewCount: 2,
    badges: ["best-seller", "featured"],
    origin: "Sunnybrook, Georgia",
    farm: "Golden Egg Farm",
    sold: 212,
    createdAt: "2026-07-16",
    specs: [
      { label: "Age", value: "16 weeks" },
      { label: "Breed", value: "ISA Brown" },
      { label: "Vaccines", value: "Marek's, IB, ND, Gumboro" },
      { label: "Eggs/yr", value: "300+" },
    ],
    tags: ["layers", "pullets", "vaccinated"],
    imageLabel: "PULLETS",
  },
  {
    id: "p10",
    slug: "broad-breasted-turkey-poults",
    name: "Broad Breasted Turkey Poults",
    shortDescription: "Day-old to 3-week poults, hatchery certified",
    description:
      "Healthy broad breasted white turkey poults, sexed and hatchery certified. Poult-appropriate vaccines and starter feeding guide included with every order.",
    categorySlug: "poultry",
    emoji: "🦃",
    price: 95,
    unit: "pack of 6",
    stock: 9,
    rating: 4.7,
    reviewCount: 1,
    badges: ["new"],
    origin: "Sunnybrook, Georgia",
    farm: "Golden Egg Farm",
    sold: 38,
    createdAt: "2026-07-22",
    specs: [
      { label: "Age", value: "1–3 weeks" },
      { label: "Sexing", value: "Assorted/sexed" },
      { label: "Certification", value: "NPIP" },
      { label: "Maturity", value: "≈ 14 weeks" },
    ],
    tags: ["turkey", "poults", "holiday"],
    imageLabel: "TURKEYS",
  },
  {
    id: "p11",
    slug: "pekin-ducks",
    name: "Pekin Ducks",
    shortDescription: "4-week-old Pekin ducklings, strong and feathered",
    description:
      "Fast-growing Pekin ducklings at 4 weeks, fully feathered and hardy. Reared on clean water and commercial starter. Great for meat production — ready at 7–8 weeks with proper feeding.",
    categorySlug: "poultry",
    emoji: "🦆",
    price: 88,
    unit: "pack of 4",
    stock: 7,
    rating: 4.6,
    reviewCount: 0,
    badges: [],
    origin: "Creek Side, Arkansas",
    farm: "Duck Hollow Farm",
    sold: 29,
    createdAt: "2026-07-19",
    specs: [
      { label: "Age", value: "4 weeks" },
      { label: "Breed", value: "Pekin" },
      { label: "Feathered", value: "Yes" },
      { label: "Harvest age", value: "7–8 weeks" },
    ],
    tags: ["duck", "pekin", "meat"],
    imageLabel: "DUCKS",
  },
  {
    id: "p12",
    slug: "day-old-broiler-chicks",
    name: "Day-Old Broiler Chicks (50)",
    shortDescription: "Ross 308 broiler chicks, delivered chilled",
    description:
      "Fifty day-old Ross 308 broiler chicks delivered within 24 hours of hatch. Packed in temperature-controlled chick boxes with gel. Vaccinated against Marek's disease.",
    categorySlug: "poultry",
    emoji: "🐤",
    price: 120,
    unit: "box of 50",
    stock: 4,
    rating: 4.8,
    reviewCount: 1,
    badges: ["best-seller"],
    origin: "Sunnybrook, Georgia",
    farm: "Golden Egg Farm",
    sold: 154,
    createdAt: "2026-07-08",
    specs: [
      { label: "Breed", value: "Ross 308" },
      { label: "Count", value: "50 chicks" },
      { label: "Vaccination", value: "Marek's" },
      { label: "Delivery", value: "Within 24h of hatch" },
    ],
    tags: ["broiler", "chicks", "ross"],
    imageLabel: "CHICKS",
  },
  {
    id: "p13",
    slug: "missouri-fox-trotter-gelding",
    name: "Missouri Fox Trotter Gelding",
    shortDescription: "7-year-old trail gelding, smooth gaits, bombproof",
    description:
      "A gentle 7-year-old Missouri Fox Trotter gelding. Smooth, sure-footed gaits, fully trail-broken, and safe around traffic, dogs and kids. Current Coggins, sound vetting report and farrier care records included.",
    categorySlug: "horses",
    emoji: "🐎",
    price: 5400,
    unit: "head",
    stock: 1,
    rating: 5,
    reviewCount: 1,
    badges: ["featured", "certified"],
    origin: "Ozark Foothills, Missouri",
    farm: "Fox Meadow Stables",
    sold: 6,
    createdAt: "2026-06-10",
    specs: [
      { label: "Age", value: "7 years" },
      { label: "Height", value: "15.1 hh" },
      { label: "Breed", value: "MFTHBA registered" },
      { label: "Temperament", value: "Bombproof" },
    ],
    tags: ["horse", "trail", "gaited"],
    imageLabel: "GELDING",
  },
  {
    id: "p14",
    slug: "new-zealand-white-rabbit-trio",
    name: "New Zealand White Rabbit Trio",
    shortDescription: "1 buck + 2 does, proven producers",
    description:
      "A proven New Zealand White trio — one buck and two does — from a closed colony selected for growth rate and docility. All three are registered, tattooed and free of common health issues.",
    categorySlug: "rabbits",
    emoji: "🐰",
    price: 210,
    unit: "trio",
    stock: 2,
    rating: 4.9,
    reviewCount: 1,
    badges: ["certified"],
    origin: "Green Hills, Vermont",
    farm: "Maple Warren Farm",
    sold: 17,
    createdAt: "2026-07-24",
    specs: [
      { label: "Breed", value: "New Zealand White" },
      { label: "Composition", value: "1 buck + 2 does" },
      { label: "Registration", value: "ARBA" },
      { label: "Age range", value: "6–12 months" },
    ],
    tags: ["rabbits", "breeding", "meat"],
    imageLabel: "RABBITS",
  },
  {
    id: "p15",
    slug: "pasture-layer-feed-25kg",
    name: "Pasture-Raised Layer Feed (25 kg)",
    shortDescription: "Non-GMO layer ration with added calcium",
    description:
      "A balanced 16% protein layer ration formulated with locally grown, non-GMO grains. Includes oyster shell calcium for strong shells and probiotics for digestive health. Batch-dated and milled fresh weekly.",
    categorySlug: "supplies",
    emoji: "🌾",
    price: 38,
    compareAtPrice: 45,
    unit: "25 kg bag",
    stock: 60,
    rating: 4.8,
    reviewCount: 1,
    badges: ["organic", "sale"],
    origin: "Corn Belt, Illinois",
    farm: "Harvest Mill Co.",
    sold: 412,
    createdAt: "2026-07-01",
    specs: [
      { label: "Protein", value: "16%" },
      { label: "Size", value: "25 kg bag" },
      { label: "GMO", value: "Non-GMO" },
      { label: "Extras", value: "Calcium + probiotics" },
    ],
    tags: ["feed", "layers", "organic"],
    imageLabel: "FEED",
  },
  {
    id: "p16",
    slug: "organic-alfalfa-bales",
    name: "Organic Alfalfa Bales (30)",
    shortDescription: "Certified organic, second-cut alfalfa bales",
    description:
      "Thirty certified organic, second-cut alfalfa bales. Bright green, leafy and sweet-smelling — baled at 14% moisture. Excellent for dairy does, horses and growing lambs.",
    categorySlug: "supplies",
    emoji: "🌿",
    price: 220,
    unit: "lot of 30",
    stock: 8,
    rating: 4.7,
    reviewCount: 0,
    badges: ["organic"],
    origin: "High Plains, Nebraska",
    farm: "Prairie Wind Hay",
    sold: 25,
    createdAt: "2026-07-17",
    specs: [
      { label: "Cut", value: "Second cut" },
      { label: "Moisture", value: "14%" },
      { label: "Weight", value: "≈ 27 kg each" },
      { label: "Certification", value: "USDA Organic" },
    ],
    tags: ["hay", "alfalfa", "organic"],
    imageLabel: "HAY",
  },
  {
    id: "p17",
    slug: "free-range-brown-eggs",
    name: "Free-Range Brown Eggs (30)",
    shortDescription: "Weekly-fresh free-range eggs, local farm",
    description:
      "Thirty large free-range brown eggs collected within 72 hours of your delivery window. From pasture-raised hens with organic grain access. Carbon-neutral local delivery every Saturday.",
    categorySlug: "eggs-dairy",
    emoji: "🥚",
    price: 14,
    unit: "tray of 30",
    stock: 44,
    rating: 5,
    reviewCount: 1,
    badges: ["featured", "best-seller"],
    origin: "Maple County, Oregon",
    farm: "Wildflower Eggs",
    sold: 618,
    createdAt: "2026-07-21",
    specs: [
      { label: "Count", value: "30 large eggs" },
      { label: "Sourcing", value: "Pasture-raised" },
      { label: "Collection", value: "< 72h before delivery" },
      { label: "Packaging", value: "Recycled tray" },
    ],
    tags: ["eggs", "free-range", "weekly"],
    imageLabel: "EGGS",
  },
  {
    id: "p18",
    slug: "raw-jersey-cream",
    name: "Raw Jersey Cream",
    shortDescription: "Unpasteurised A2 cream, small-batch weekly",
    description:
      "Thick, golden raw cream from grass-fed Jersey cows. A2/A2 certified, cold-chained from milking to your door within 48 hours. Sold in a returnable 500 ml glass jar.",
    categorySlug: "eggs-dairy",
    emoji: "🥛",
    price: 9,
    compareAtPrice: 11,
    unit: "500 ml jar",
    stock: 36,
    rating: 4.9,
    reviewCount: 1,
    badges: ["organic", "sale"],
    origin: "Maple County, Oregon",
    farm: "Wildflower Eggs",
    sold: 203,
    createdAt: "2026-07-25",
    specs: [
      { label: "Size", value: "500 ml jar" },
      { label: "Butterfat", value: "38–40%" },
      { label: "Genetics", value: "A2/A2" },
      { label: "Shelf life", value: "7–10 days chilled" },
    ],
    tags: ["dairy", "cream", "raw"],
    imageLabel: "CREAM",
  },
]

export const products: Product[] = seeds.map((seed) => ({
  id: seed.id,
  slug: seed.slug,
  name: seed.name,
  shortDescription: seed.shortDescription,
  description: seed.description,
  categoryId: categoryId(seed.categorySlug),
  price: seed.price,
  compareAtPrice: seed.compareAtPrice,
  currency: "USD",
  unit: seed.unit,
  stock: seed.stock,
  images: imagesFor(seed.categorySlug, seed.emoji, seed.imageLabel),
  rating: seed.rating,
  reviewCount: seed.reviewCount,
  reviews: seed.reviewCount
    ? reviews[reviewKeyFor(seed.categorySlug)]().slice(0, seed.reviewCount)
    : [],
  badges: seed.badges,
  origin: seed.origin,
  farm: seed.farm,
  sold: seed.sold,
  createdAt: seed.createdAt,
  specs: seed.specs,
  tags: seed.tags,
}))
