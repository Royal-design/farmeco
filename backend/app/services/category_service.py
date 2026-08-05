from uuid import UUID

from slugify import slugify

from app.core.exceptions import AppException
from app.models.category import Category
from app.repositories.category_repository import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    # -------------------------
    # GET ALL CATEGORIES
    # -------------------------
    def get_all_categories(
        self,
        featured: bool | None = None,
        search: str | None = None,
    ) -> list[Category]:
        return self.repository.get_all_categories(featured=featured, search=search)

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

    # -------------------------
    # CREATE CATEGORY
    # -------------------------
    def create_category(self, category: CategoryCreate) -> Category:
        name = category.name.strip()
        slug = category.slug.strip() if category.slug else slugify(name)

        if self.repository.get_category_by_name(name):
            raise AppException(
                message="Category with this name already exists",
                status_code=409,
                error_code="CATEGORY_ALREADY_EXISTS",
            )

        db_category = Category(
            **category.model_dump(exclude={"slug", "name"}),
            name=name,
            slug=slug,
        )

        return self.repository.create_category(db_category)

    # -------------------------
    # UPDATE CATEGORY
    # -------------------------
    def update_category(self, category_id: UUID, category: CategoryUpdate) -> Category:
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

        return self.repository.update_category(db_category)

    # -------------------------
    # DELETE CATEGORY
    # -------------------------
    def delete_category(self, category_id: UUID) -> Category:
        db_category = self.get_category_by_id(category_id)

        if db_category.product_count > 0:
            raise AppException(
                message="Cannot delete a category that still has products",
                status_code=400,
                error_code="CATEGORY_HAS_PRODUCTS",
            )

        return self.repository.delete_category(db_category)

    # -------------------------
    # RECALCULATE PRODUCT COUNT
    # -------------------------
    def recalculate_product_count(self, category_id: UUID) -> None:
        self.repository.recalculate_product_count(category_id)
