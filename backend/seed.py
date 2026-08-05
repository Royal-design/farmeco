"""Seed the Farmeco database with an admin account, categories, and sample products.

Run from the backend directory:

    .venv/Scripts/python.exe seed.py
"""
import base64
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.category import Category
from app.models.enums import ProductStatus, UserRole
from app.models.product import Product
from app.models.user import DEFAULT_PREFERENCES, User
from sqlalchemy import func

ADMIN_EMAIL = "admin@gmail.com"
ADMIN_PASSWORD = "Password111"
ADMIN_NAME = "Farmeco Admin"

CATEGORIES = [
    {
        "name": "Cattle",
        "slug": "cattle",
        "short_description": "Beef & dairy cattle from certified herds",
        "description": "Health-checked beef and dairy cattle raised on pasture. Fully vaccinated, dewormed and ready to thrive on your farm.",
        "emoji": "🐄",
        "accent": "cattle",
        "featured": True,
    },
    {
        "name": "Goats & Sheep",
        "slug": "goats-sheep",
        "short_description": "Boer goats, dairy does & hardy sheep",
        "description": "Boer goats, Kiko kids, dairy does and cold-hardy sheep breeds with full veterinary records and DNA testing.",
        "emoji": "🐐",
        "accent": "goats-sheep",
        "featured": True,
    },
    {
        "name": "Pigs",
        "slug": "pigs",
        "short_description": "Heritage & hybrid weaners",
        "description": "Pasture-raised heritage and hybrid piglets, weaned and dewormed, from biosecure breeding programs.",
        "emoji": "🐖",
        "accent": "pigs",
        "featured": True,
    },
    {
        "name": "Poultry",
        "slug": "poultry",
        "short_description": "Layers, broilers, turkeys & ducks",
        "description": "Day-old chicks, pullets, broilers, turkeys, ducks and geese — vaccinated and hatchery certified.",
        "emoji": "🐔",
        "accent": "poultry",
        "featured": True,
    },
    {
        "name": "Horses",
        "slug": "horses",
        "short_description": "Working & leisure horses",
        "description": "Gentle, trail-ready and working horses with sound vetting, farrier care and temperament testing.",
        "emoji": "🐎",
        "accent": "horses",
        "featured": False,
    },
    {
        "name": "Rabbits",
        "slug": "rabbits",
        "short_description": "Meat & fancy breeds",
        "description": "Healthy meat breeds like New Zealand and Californian, plus select fancy breeds for hobbyists.",
        "emoji": "🐇",
        "accent": "rabbits",
        "featured": False,
    },
    {
        "name": "Feed & Supplies",
        "slug": "supplies",
        "short_description": "Feed, health & farm essentials",
        "description": "Quality feed, mineral supplements, fencing, waterers and veterinary essentials from trusted brands.",
        "emoji": "🌾",
        "accent": "supplies",
        "featured": False,
    },
    {
        "name": "Eggs & Dairy",
        "slug": "eggs-dairy",
        "short_description": "Farm-fresh eggs & dairy",
        "description": "Free-range eggs, raw and cultured dairy sourced daily from family farms within 40 km of you.",
        "emoji": "🥚",
        "accent": "eggs-dairy",
        "featured": False,
    },
]

# name, category slug, price, unit, stock, badges, sold, tags, origin, farm, spec pairs
PRODUCTS = [
    # Cattle
    ("Certified White Fulani Heifer", "cattle", 450000, "head", 12, ["featured", "top", "best-seller"], 86,
     ["cattle", "heifer", "dairy"], "Karu", "Willow Creek Farm", [("Breed", "White Fulani"), ("Age", "18 months"), ("Weight", "280 kg")]),
    ("Red Bororo Breeding Bull", "cattle", 820000, "head", 6, ["featured", "certified"], 41,
     ["cattle", "bull", "breeding"], "Suleja", "Bluebonnet Ranch", [("Breed", "Red Bororo"), ("Age", "36 months"), ("Weight", "520 kg")]),
    ("Friesian Dairy Cow (Lactating)", "cattle", 1_200_000, "head", 4, ["top", "organic"], 23,
     ["cattle", "dairy", "friesian"], "Karu", "Fox Meadow Dairy", [("Breed", "Friesian"), ("Milk", "22 L/day"), ("Age", "4 years")]),
    # Goats & Sheep
    ("Purebred Boer Goat Buck", "goats-sheep", 185000, "head", 15, ["featured", "best-seller"], 132,
     ["goats", "boer", "buck"], "Bwari", "Greenfield Valley Farm", [("Breed", "Boer"), ("Age", "12 months"), ("Weight", "78 kg")]),
    ("Kiko Goat Doe", "goats-sheep", 120000, "head", 20, ["new", "organic"], 57,
     ["goats", "kiko", "doe"], "Bwari", "Greenfield Valley Farm", [("Breed", "Kiko"), ("Age", "10 months"), ("Weight", "48 kg")]),
    ("Dorper Sheep Ewe", "goats-sheep", 145000, "head", 18, ["new"], 44,
     ["sheep", "dorper"], "Nyanya", "Pasture Ridge Farm", [("Breed", "Dorper"), ("Age", "14 months"), ("Weight", "52 kg")]),
    # Pigs
    ("Large White Weaner Pigs", "pigs", 65000, "head", 30, ["featured", "best-seller"], 214,
     ["pigs", "weaner", "large-white"], "Karu", "Highland Piggery", [("Breed", "Large White"), ("Age", "8 weeks"), ("Weight", "18 kg")]),
    ("Duroc Breeding Sow", "pigs", 240000, "head", 5, ["certified", "top"], 19,
     ["pigs", "duroc", "sow"], "Suleja", "Highland Piggery", [("Breed", "Duroc"), ("Age", "20 months"), ("Weight", "180 kg")]),
    # Poultry
    ("ISA Brown Pullets (16 weeks)", "poultry", 8500, "bird", 500, ["featured", "top", "best-seller"], 1220,
     ["poultry", "layers", "pullets"], "Karu", "Sunrise Poultry Farm", [("Age", "16 weeks"), ("Strain", "ISA Brown"), ("Laying", "Week 18+")]),
    ("Broiler Chicks (Day-old)", "poultry", 1200, "bird", 2000, ["new", "sale"], 3100,
     ["poultry", "broiler", "chicks"], "Karu", "Sunrise Poultry Farm", [("Age", "Day-old"), ("Strain", "Cobb 500"), ("Vaccinated", "Yes")]),
    ("Broad Breasted White Turkey Poults", "poultry", 15000, "bird", 80, ["certified"], 96,
     ["poultry", "turkey", "poults"], "Bwari", "Feathercrest Farm", [("Age", "6 weeks"), ("Breed", "BBW"), ("Vaccinated", "Yes")]),
    ("Muscovy Duck (Adult Pair)", "poultry", 28000, "pair", 25, ["organic"], 38,
     ["poultry", "ducks", "muscovy"], "Nyanya", "Feathercrest Farm", [("Age", "8 months"), ("Type", "Breeding pair")]),
    # Horses
    ("Trail-Ready Quarter Horse Gelding", "horses", 1_500_000, "head", 3, ["featured", "certified"], 9,
     ["horses", "quarter-horse", "trail"], "Suleja", "Cedar Creek Stables", [("Breed", "Quarter Horse"), ("Age", "6 years"), ("Temperament", "Calm")]),
    # Rabbits
    ("New Zealand White Breeding Buck", "rabbits", 22000, "head", 40, ["new", "organic"], 74,
     ["rabbits", "new-zealand"], "Bwari", "Burrow Haven", [("Breed", "New Zealand White"), ("Age", "6 months"), ("Weight", "4.5 kg")]),
    # Supplies
    ("50kg Layer Mash Feed", "supplies", 32000, "bag", 350, ["best-seller"], 980,
     ["feed", "poultry", "layer-mash"], "Karu", "Farmeco Supplies", [("Weight", "50 kg"), ("Crude protein", "18%")]),
    ("Complete Mineral Supplement 25kg", "supplies", 18000, "bag", 200, ["new"], 145,
     ["supplements", "minerals"], "Karu", "Farmeco Supplies", [("Weight", "25 kg"), ("For", "Cattle & small ruminants")]),
    # Eggs & Dairy
    ("Free-Range Eggs (Crate of 30)", "eggs-dairy", 6500, "crate", 600, ["featured", "organic", "top"], 2400,
     ["eggs", "free-range"], "Nyanya", "Sunrise Poultry Farm", [("Count", "30"), ("Grade", "Large")]),
    ("Raw Cow Milk (2L Bottle)", "eggs-dairy", 4500, "bottle", 120, ["new"], 310,
     ["dairy", "milk", "raw"], "Karu", "Fox Meadow Dairy", [("Volume", "2 L"), ("Pasteurised", "No")]),
]

PALETTES = {
    "cattle": ("#2f5d3f", "#7d8f4d"),
    "goats-sheep": ("#4d7c58", "#a8895b"),
    "pigs": ("#9a6a2f", "#c08a4a"),
    "poultry": ("#3f7a82", "#8a5f99"),
    "horses": ("#6b4e3a", "#8a6f5b"),
    "rabbits": ("#7d5a8a", "#b59a6b"),
    "supplies": ("#5a7a3f", "#c99a5b"),
    "eggs-dairy": ("#b5913f", "#e8d9a0"),
}


def svg_data_uri(emoji: str, from_color: str, to_color: str) -> str:
    svg = (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>"
        f"<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>"
        f"<stop offset='0%' stop-color='{from_color}'/>"
        f"<stop offset='100%' stop-color='{to_color}'/>"
        f"</linearGradient></defs>"
        f"<rect width='800' height='600' fill='url(#g)'/>"
        f"<circle cx='400' cy='300' r='190' fill='rgba(255,255,255,0.12)'/>"
        f"<text x='400' y='360' font-size='230' text-anchor='middle'>{emoji}</text>"
        f"</svg>"
    )
    encoded = base64.b64encode(svg.encode("utf-8")).decode("ascii")
    return f"data:image/svg+xml;base64,{encoded}"


def get_or_create_admin(db):
    admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
    if admin:
        return admin, False

    admin = User(
        name=ADMIN_NAME,
        email=ADMIN_EMAIL,
        password=hash_password(ADMIN_PASSWORD),
        role=UserRole.ADMIN,
        is_verified=True,
        preferences=DEFAULT_PREFERENCES.copy(),
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin, True


def seed_categories(db):
    created = 0
    for data in CATEGORIES:
        exists = db.query(Category).filter(Category.slug == data["slug"]).first()
        if exists:
            continue
        db.add(Category(**data))
        created += 1
    db.commit()
    return created


def seed_products(db, admin):
    categories = {c.slug: c for c in db.query(Category).all()}
    created = 0

    for name, cat_slug, price, unit, stock, badges, sold, tags, origin, farm, specs in PRODUCTS:
        slug = name.lower().replace("(", "").replace(")", "").replace(",", "").replace("&", "and")
        slug = "-".join(slug.split())

        exists = db.query(Product).filter(Product.slug == slug).first()
        if exists:
            continue

        category = categories[cat_slug]
        emoji = category.emoji
        from_color, to_color = PALETTES[cat_slug]
        image = svg_data_uri(emoji, from_color, to_color)
        alt_image = svg_data_uri(emoji, to_color, from_color)

        db.add(Product(
            slug=slug,
            name=name,
            short_description=(
                f"{name} from {farm} — healthy, well-handled and ready for your farm."
            ),
            description=(
                f"This {name.lower()} comes from {farm} ({origin}) with full veterinary records. "
                f"Health-checked, vaccinated and well-handled, it is ready for immediate transition "
                f"to your farm. Free 7-day health guarantee and complete paperwork included."
            ),
            category_id=category.id,
            seller_id=admin.id,
            price=price,
            currency="NGN",
            unit=unit,
            stock=stock,
            sold=sold,
            images=[image, alt_image],
            specs=[{"label": label, "value": value} for label, value in specs],
            tags=tags,
            badges=badges,
            origin=origin,
            farm=farm,
            status=ProductStatus.PUBLISHED,
            is_active=True,
        ))
        created += 1

    db.commit()
    return created


def recalculate_product_counts(db):
    for category in db.query(Category).all():
        category.product_count = (
            db.query(func.count(Product.id))
            .filter(Product.category_id == category.id)
            .scalar()
            or 0
        )
    db.commit()


def main():
    db = SessionLocal()
    try:
        admin, admin_created = get_or_create_admin(db)
        categories = seed_categories(db)
        products = seed_products(db, admin)
        recalculate_product_counts(db)

        print("Seed complete:")
        print(f"  Admin account  : {ADMIN_EMAIL} / {ADMIN_PASSWORD} {'(created)' if admin_created else '(already exists)'}")
        print(f"  Categories     : {categories} created")
        print(f"  Products       : {products} created")
    finally:
        db.close()


if __name__ == "__main__":
    main()
