from math import ceil
from uuid import UUID

from sqlalchemy import or_
from sqlalchemy.orm import Session, selectinload

from app.models.category import Category
from app.models.enums import ProductStatus
from app.models.product import Product
from app.models.review import Review


class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def _base_query(self):
        return self.db.query(Product).options(selectinload(Product.category))

    def _detail_query(self):
        return self.db.query(Product).options(
            selectinload(Product.category),
            selectinload(Product.reviews).selectinload(Review.user),
        )

    def _apply_filters(
        self,
        query,
        category: str | None = None,
        search: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        rating: float | None = None,
        badge: str | None = None,
        in_stock: bool = False,
        ids: list[UUID] | None = None,
        status: ProductStatus | None = None,
    ):
        if category and category != "all":
            query = query.join(Category, Product.category_id == Category.id).filter(
                Category.slug == category
            )

        if search:
            like = f"%{search}%"
            query = query.filter(
                or_(
                    Product.name.ilike(like),
                    Product.short_description.ilike(like),
                    Product.description.ilike(like),
                    Product.origin.ilike(like),
                    Product.farm.ilike(like),
                    Product.tags.contains([search]),
                )
            )

        if min_price is not None:
            query = query.filter(Product.price >= min_price)

        if max_price is not None:
            query = query.filter(Product.price <= max_price)

        if rating is not None:
            query = query.filter(Product.rating >= rating)

        if badge:
            query = query.filter(Product.badges.contains([badge]))

        if in_stock:
            query = query.filter(Product.stock > 0)

        if ids:
            query = query.filter(Product.id.in_(ids))

        if status:
            query = query.filter(Product.status == status)

        return query

    def get_all_products(
        self,
        category: str | None = None,
        search: str | None = None,
        sort: str = "popular",
        min_price: float | None = None,
        max_price: float | None = None,
        rating: float | None = None,
        badge: str | None = None,
        in_stock: bool = False,
        ids: list[UUID] | None = None,
        status: ProductStatus = ProductStatus.PUBLISHED,
        page: int = 1,
        page_size: int = 12,
    ) -> tuple[list[Product], int, int]:
        query = self._base_query().filter(Product.is_active == True)

        query = self._apply_filters(
            query,
            category=category,
            search=search,
            min_price=min_price,
            max_price=max_price,
            rating=rating,
            badge=badge,
            in_stock=in_stock,
            ids=ids,
            status=status,
        )

        total = query.count()

        ordering = {
            "newest": Product.created_at.desc(),
            "price-asc": Product.price.asc(),
            "price-desc": Product.price.desc(),
            "popular": Product.sold.desc(),
            "rating": Product.rating.desc(),
        }
        order_by = ordering.get(sort, Product.sold.desc())

        offset = (page - 1) * page_size
        products = (
            query
            .order_by(order_by, Product.created_at.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        total_pages = ceil(total / page_size) if page_size else 0
        return products, total, total_pages

    def get_product_by_id(self, product_id: UUID) -> Product | None:
        return self._detail_query().filter(Product.id == product_id).first()

    def get_product_by_slug(self, slug: str) -> Product | None:
        return self._detail_query().filter(Product.slug == slug).first()

    def get_products_by_ids(self, ids: list[UUID]) -> list[Product]:
        if not ids:
            return []
        return self._base_query().filter(Product.id.in_(ids)).all()

    def get_related_products(self, product_id: UUID, limit: int = 4) -> list[Product]:
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return []

        related = (
            self._base_query()
            .filter(
                Product.category_id == product.category_id,
                Product.id != product_id,
                Product.is_active == True,
            )
            .order_by(Product.sold.desc(), Product.created_at.desc())
            .limit(limit)
            .all()
        )

        if len(related) < limit:
            existing_ids = {p.id for p in related}
            popular = (
                self._base_query()
                .filter(
                    Product.id != product_id,
                    Product.is_active == True,
                    ~Product.id.in_(existing_ids),
                )
                .order_by(Product.sold.desc(), Product.created_at.desc())
                .limit(limit - len(related))
                .all()
            )
            related.extend(popular)

        return related

    def create_product(self, product: Product) -> Product:
        self.db.add(product)
        self.db.commit()
        return self.get_product_by_id(product.id)

    def update_product(self, product: Product) -> Product:
        self.db.commit()
        return self.get_product_by_id(product.id)

    def delete_product(self, product: Product) -> Product:
        self.db.delete(product)
        self.db.commit()
        return product

    def record_sale(self, product_id: UUID, quantity: int) -> None:
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if product:
            product.stock = max(0, product.stock - quantity)
            product.sold = product.sold + quantity
            self.db.commit()

    def restore_sale(self, product_id: UUID, quantity: int) -> None:
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if product:
            product.stock = product.stock + quantity
            product.sold = max(0, product.sold - quantity)
            self.db.commit()
