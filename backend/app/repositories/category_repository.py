from uuid import UUID

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.product import Product


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_categories(
        self,
        featured: bool | None = None,
        search: str | None = None,
    ) -> list[Category]:
        query = self.db.query(Category)

        if featured is not None:
            query = query.filter(Category.featured == featured)

        if search:
            like = f"%{search}%"
            query = query.filter(
                or_(
                    Category.name.ilike(like),
                    Category.slug.ilike(like),
                    Category.short_description.ilike(like),
                )
            )

        return (
            query
            .order_by(Category.featured.desc(), Category.name.asc())
            .all()
        )

    def get_category_by_id(self, category_id: UUID) -> Category | None:
        return self.db.query(Category).filter(Category.id == category_id).first()

    def get_category_by_slug(self, slug: str) -> Category | None:
        return self.db.query(Category).filter(Category.slug == slug).first()

    def get_category_by_name(self, name: str) -> Category | None:
        return self.db.query(Category).filter(Category.name == name).first()

    def create_category(self, category: Category) -> Category:
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category

    def update_category(self, category: Category) -> Category:
        self.db.commit()
        self.db.refresh(category)
        return category

    def delete_category(self, category: Category) -> Category:
        self.db.delete(category)
        self.db.commit()
        return category

    def recalculate_product_count(self, category_id: UUID) -> None:
        count = (
            self.db.query(func.count(Product.id))
            .filter(Product.category_id == category_id)
            .scalar()
            or 0
        )

        category = self.get_category_by_id(category_id)
        if category:
            category.product_count = count
            self.db.commit()
