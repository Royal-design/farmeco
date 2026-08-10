import base64
from uuid import UUID

from slugify import slugify

from app.core.exceptions import AppException
from app.models.category import Category
from app.models.user import User
from app.repositories.category_repository import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.services.audit_service import AuditService

CATEGORY_PALETTES = {
    "cattle": ("#2f5d3f", "#7d8f4d"),
    "goats-sheep": ("#4d7c58", "#a8895b"),
    "pigs": ("#9a6a2f", "#c08a4a"),
    "poultry": ("#3f7a82", "#8a5f99"),
    "horses": ("#6b4e3a", "#8a6f5b"),
    "rabbits": ("#7d5a8a", "#b59a6b"),
    "supplies": ("#5a7a3f", "#c99a5b"),
    "eggs-dairy": ("#b5913f", "#e8d9a0"),
}

DEFAULT_PALETTE = ("#4d7c58", "#a8895b")


def _svg_image(emoji: str, accent: str | None) -> str:
    from_color, to_color = CATEGORY_PALETTES.get(accent or "", DEFAULT_PALETTE)
    svg = (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>"
        f"<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>"
        f"<stop offset='0%' stop-color='{from_color}'/>"
        f"<stop offset='100%' stop-color='{to_color}'/>"
        f"</linearGradient></defs>"
        f"<rect width='800' height='600' fill='url(#g)'/>"
        f"<circle cx='400' cy='300' r='190' fill='rgba(255,255,255,0.12)'/>"
        f"<text x='400' y='360' font-size='230' text-anchor='middle'>{emoji or '🏷️'}</text>"
        f"</svg>"
    )
    encoded = base64.b64encode(svg.encode("utf-8")).decode("ascii")
    return f"data:image/svg+xml;base64,{encoded}"


class CategoryService:
    def __init__(self, repository: CategoryRepository, audit_service: AuditService | None = None):
        self.repository = repository
        self.audit_service = audit_service

    # -------------------------
    # GET ALL CATEGORIES
    # -------------------------
    def get_all_categories(
        self,
        featured: bool | None = None,
        search: str | None = None,
        sort: str = "featured",
    ) -> list[Category]:
        return self.repository.get_all_categories(
            featured=featured,
            search=search,
            sort=sort,
        )

    # -------------------------
    # GET FEATURED CATEGORIES
    # -------------------------
    def get_featured_categories(self) -> list[Category]:
        return self.repository.get_all_categories(featured=True)

    # -------------------------
    # GET CATEGORY BY ID
    # -------------------------
    def get_category_by_id(self, category_id: UUID) -> Category:
        category = self.repository.get_category_by_id(category_id)

        if not category:
            raise AppException(
                message="Category not found",
                status_code=404,
                error_code="CATEGORY_NOT_FOUND",
            )

        return category

    # -------------------------
    # GET CATEGORY BY SLUG
    # -------------------------
    def get_category_by_slug(self, slug: str) -> Category:
        category = self.repository.get_category_by_slug(slug)

        if not category:
            raise AppException(
                message="Category not found",
                status_code=404,
                error_code="CATEGORY_NOT_FOUND",
            )

        return category

    def get_category_by_name(self, name: str) -> Category | None:
        return self.repository.get_category_by_name(name)

    # -------------------------
    # CREATE CATEGORY
    # -------------------------
    def create_category(self, category: CategoryCreate, actor: User | None = None) -> Category:
        name = category.name.strip()
        slug = category.slug.strip() if category.slug else slugify(name)

        if self.repository.get_category_by_name(name):
            raise AppException(
                message="Category with this name already exists",
                status_code=409,
                error_code="CATEGORY_ALREADY_EXISTS",
            )

        payload = category.model_dump(exclude={"slug", "name"})
        payload["image"] = category.image or _svg_image(category.emoji, category.accent)

        db_category = Category(**payload, name=name, slug=slug)

        created = self.repository.create_category(db_category)

        if self.audit_service:
            self.audit_service.record(
                actor=actor,
                action="CREATE",
                resource_type="category",
                resource_id=created.id,
                summary=f"Created category \"{created.name}\"",
                after={"name": created.name, "slug": created.slug},
            )

        return created

    # -------------------------
    # UPDATE CATEGORY
    # -------------------------
    def update_category(self, category_id: UUID, category: CategoryUpdate, actor: User | None = None) -> Category:
        db_category = self.get_category_by_id(category_id)

        updates = category.model_dump(exclude_unset=True)

        if "name" in updates:
            existing = self.repository.get_category_by_name(updates["name"])
            if existing and existing.id != category_id:
                raise AppException(
                    message="Category with this name already exists",
                    status_code=409,
                    error_code="CATEGORY_ALREADY_EXISTS",
                )

        for key, value in updates.items():
            setattr(db_category, key, value)

        if not db_category.image:
            db_category.image = _svg_image(
                db_category.emoji,
                db_category.accent,
            )

        updated = self.repository.update_category(db_category)

        if self.audit_service:
            self.audit_service.record(
                actor=actor,
                action="UPDATE",
                resource_type="category",
                resource_id=db_category.id,
                summary=f"Updated category \"{db_category.name}\"",
                after={"name": db_category.name, "changes": list(updates.keys())},
            )

        return updated

    # -------------------------
    # DELETE CATEGORY
    # -------------------------
    def delete_category(self, category_id: UUID, actor: User | None = None) -> Category:
        db_category = self.get_category_by_id(category_id)

        if db_category.product_count > 0:
            raise AppException(
                message="Cannot delete a category that still has products",
                status_code=400,
                error_code="CATEGORY_HAS_PRODUCTS",
            )

        deleted = self.repository.delete_category(db_category)

        if self.audit_service:
            self.audit_service.record(
                actor=actor,
                action="DELETE",
                resource_type="category",
                resource_id=db_category.id,
                summary=f"Deleted category \"{db_category.name}\"",
                before={"name": db_category.name, "slug": db_category.slug},
            )

        return deleted

    # -------------------------
    # RECALCULATE PRODUCT COUNT
    # -------------------------
    def recalculate_product_count(self, category_id: UUID) -> None:
        self.repository.recalculate_product_count(category_id)
