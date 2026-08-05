import type { BlogPost } from "@/types/blog"
import { scene } from "@/mock/art"
import { avatar } from "@/mock/art"

function cover(emoji: string, from: string, via: string, to: string, glow: string) {
  return scene(emoji, { from, via, to, glow }, "", false)
}

const authorMarcus = {
  name: "Marcus Bennett",
  role: "Livestock consultant",
  avatar: avatar("#4d7c58", "#a8895b", "MB"),
}

const authorElena = {
  name: "Elena Voss",
  role: "Dairy specialist",
  avatar: avatar("#3f7a82", "#8a5f99", "EV"),
}

const authorHannah = {
  name: "Hannah Wu",
  role: "Poultry nutritionist",
  avatar: avatar("#2f5d3f", "#3f7a82", "HW"),
}

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    slug: "buying-healthy-livestock-checklist",
    title: "The 12-point checklist for buying healthy livestock",
    excerpt:
      "Health records, temperament, biosecurity and transport — the essential checks before you hand over a single cent.",
    coverImage: cover("🐄", "#2f5d3f", "#4d7c58", "#27432f", "#a8d5b0"),
    category: "Buying Guide",
    author: authorMarcus,
    publishedAt: "2026-07-14",
    readTime: 6,
    tags: ["buying", "health", "livestock"],
    featured: true,
    content: [
      "Buying livestock is a long-term commitment, and the wrong choice can cost you months of heartache. Whether you're adding a single heifer or a dozen ewes, a disciplined checklist separates a smooth start from an expensive mistake.",
      "Start with the paperwork. A legitimate seller will happily share vaccination records, treatment logs and, where relevant, registration papers before you visit. If anything is vague, treat it as a red flag rather than an inconvenience.",
      "Next, look at the animal's environment. Clean water, good footing and healthy companions are strong indicators of a well-run operation. An animal that looks good in a muddy pen on the day of sale may not be the animal you're taking home.",
      "Temperament matters more than most buyers realise. Walk the pen, move the animal, and watch how it reacts to handling. Calm, curious animals adapt faster to new farms and are safer for families and staff.",
      "Finally, plan the transition. Quarantine new arrivals for at least three weeks, watch their dung and appetite daily, and have a vet check them within a week. Those simple habits protect everything you've built on the farm.",
      "A little preparation today means years of healthy, productive animals tomorrow. Bookmark this checklist and share it with anyone buying their first livestock this season.",
    ],
  },
  {
    id: "b2",
    slug: "raising-backyard-chickens-for-beginners",
    title: "Raising backyard chickens: a beginner's roadmap",
    excerpt:
      "From coop size to chick starter, everything you need to keep your first flock healthy, happy and laying.",
    coverImage: cover("🐔", "#9a6a2f", "#c08a4a", "#7a4f20", "#f7d9a0"),
    category: "Poultry",
    author: authorHannah,
    publishedAt: "2026-07-02",
    readTime: 8,
    tags: ["chickens", "beginner", "flock"],
    content: [
      "Backyard chickens are one of the most rewarding additions to a home — fresh eggs every morning and a flock full of personality. But a few early decisions set the tone for years to come.",
      "Size matters. Plan for at least 1 square metre of coop space and 3–4 square metres of run per bird. Crowding is the single biggest cause of pecking problems and disease in backyard flocks.",
      "Choose breeds that match your goals. ISA Browns and Leghorns are prolific layers. Silkies and Cochins are friendly and fun. Dual-purpose breeds like Australorps balance eggs and table birds beautifully.",
      "Start with vaccinated pullets at 16 weeks rather than day-olds if this is your first flock. They skip the fragile brooder stage and begin laying within weeks instead of months.",
      "Nutrition is simple if you buy right. A good layer ration with oyster shell on the side, clean water twice a day, and the occasional scratch grain keeps birds in peak condition.",
      "Your first month will teach you more than any article. Watch your birds daily, keep records, and call your vet early if something looks off. Before long, you'll be the neighbour everyone asks for eggs.",
    ],
  },
  {
    id: "b3",
    slug: "a2-milk-what-it-means-for-your-herd",
    title: "A2/A2 milk: what it means for your herd and your market",
    excerpt:
      "A growing group of consumers is paying a premium for A2 milk. Here's how to position your dairy herd to capture it.",
    coverImage: cover("🥛", "#b08a55", "#d0aa6a", "#8a643f", "#fff0d0"),
    category: "Dairy",
    author: authorElena,
    publishedAt: "2026-06-20",
    readTime: 7,
    tags: ["dairy", "a2", "genetics"],
    content: [
      "A2/A2 milk is no longer a niche trend. Consumers who experience discomfort with conventional milk are increasingly seeking out A2/A2 herds, and the premium in many markets now sits at 15–30% over commodity pricing.",
      "The science is straightforward. Cows carry either the A1 or A2 beta-casein gene. A2/A2 animals produce milk without the A1 protein variant associated with digestive discomfort in sensitive people.",
      "Getting there starts with a simple tail-hair DNA test, typically costing less than the sale price of one milk cheque. Breeders who genotype their herds build a genetic bank that compounds in value every generation.",
      "Marketing matters as much as genetics. Transparency sells — share test certificates, herd photos and the farm's story. Buyers on marketplaces like Farmeco filter specifically for A2/A2 certified listings.",
      "The shift isn't overnight. If you're starting a new herd, buy A2/A2-verified animals from the outset and insist on verified genetics in every breeding decision.",
      "Dairy markets reward differentiation. The farms that build A2/A2 status today are the ones charging premium prices tomorrow.",
    ],
  },
  {
    id: "b4",
    slug: "pasture-management-through-the-seasons",
    title: "Pasture management through the seasons",
    excerpt:
      "A practical grazing calendar that keeps forage quality high and feed costs low all year round.",
    coverImage: cover("🌾", "#8a7a3f", "#b09a55", "#6a5a2b", "#eee0a0"),
    category: "Farming",
    author: authorMarcus,
    publishedAt: "2026-06-05",
    readTime: 9,
    tags: ["pasture", "grazing", "seasonal"],
    content: [
      "Good pasture is your cheapest feed source, but it doesn't happen by accident. A simple seasonal plan pays dividends in animal performance and reduced supplementation.",
      "Spring is about timing. Graze early growth quickly to keep plants vegetative, then rest paddocks hard to bank summer forage. Move animals before they graze below a hand's height.",
      "Summer demands shade and water discipline. Rotate faster in the heat, graze paddocks down evenly, and consider strip grazing to extend your grass into the dry months.",
      "Autumn is the season of repair. Soil-test before you fertilise, overseed weak paddocks and manage the aftermath of summer grazing before the rains return.",
      "Winter is about protection. Poached, mud-caked pasture takes months to recover. Sacrifice paddocks, feed pads and well-bedded shelters keep the soil intact while animals stay warm.",
      "The goal is not perfect pasture every month — it's a resilient system that averages well across the year. Farmers who plan ahead feed their animals better and spend far less.",
    ],
  },
  {
    id: "b5",
    slug: "biosecurity-basics-for-small-farms",
    title: "Biosecurity basics every small farm should follow",
    excerpt:
      "Five low-cost habits that dramatically cut the risk of disease entering your herd or flock.",
    coverImage: cover("🧼", "#3f5d55", "#5b7a6a", "#2b4540", "#c0e0d0"),
    category: "Health",
    author: authorElena,
    publishedAt: "2026-05-18",
    readTime: 5,
    tags: ["biosecurity", "health", "disease"],
    content: [
      "Most disease outbreaks on small farms arrive on the boots of a visitor, a borrowed trailer or a new animal that skipped quarantine. The good news: the fixes are cheap and simple.",
      "Rule one is quarantine. New arrivals should live completely apart from your existing animals for at least three weeks. No shared water, no shared fences, ideally separate boots.",
      "Rule two is footwear. A tub of disinfectant at the gate and one pair of 'inside only' boots for your paddocks stops the vast majority of introductions cold.",
      "Rule three is knowing your sellers. Health-checked, certified listings from reputable farms dramatically reduce your risk. Ask for records before you commit — good farms are proud to share them.",
      "Rule four is observation. You know your animals' normal. Watch water intake, dung, appetite and behaviour every day, and act on the first sign of anything unusual.",
      "Biosecurity isn't about paranoia — it's about protecting the investment and the animals you care for. A few minutes a day keeps disease out for good.",
    ],
  },
  {
    id: "b6",
    slug: "talking-to-your-vet-pre-sale-exam",
    title: "What to ask your vet before any livestock purchase",
    excerpt:
      "A pre-sale exam is money well spent. Here are the exact questions that get you the answers you need.",
    coverImage: cover("🩺", "#6a4a7a", "#8a5f99", "#4a3557", "#d8b8e8"),
    category: "Buying Guide",
    author: authorHannah,
    publishedAt: "2026-04-30",
    readTime: 6,
    tags: ["vet", "buying", "health"],
    content: [
      "The most expensive animal you'll ever buy is the one you didn't vet. A pre-purchase exam rarely costs more than a fraction of the animal's price — and it routinely saves buyers from disaster.",
      "Ask your vet for a written report rather than a verbal 'looks fine'. That document protects you later and gives you leverage if a condition was missed.",
      "For breeding animals, insist on the specifics: sound reproductive tract, clean history, and in females, a confirmed pregnancy or clear record. For dairy, request recent test-day and somatic cell data.",
      "Always ask about lameness, feet and teeth. These are the quiet problems that turn a bargain into a money pit within the first season.",
      "Confirm what the exam does NOT cover. A standard exam rarely includes blood tests, ultrasound or genetic screening — decide together whether your risk profile justifies them.",
      "Finally, use the report in negotiation. A clean bill of health is worth full price. A small, documented issue is worth a conversation. Either way, you buy with your eyes open.",
    ],
  },
]
