from uuid import UUID

from fastapi import UploadFile
from slugify import slugify

from app.core.exceptions import AppException
from app.models.enums import UserRole
from app.models.product import Product
from app.models.user import User
from app.repositories.product_repository import ProductRepository
from app.schemas.product import ProductCreate, ProductUpdate
from app.schemas.user import PaginationMeta
from app.services.audit_service import AuditService
from app.services.category_service import CategoryService
from app.services.cloudinary_service import CloudinaryService


class ProductService:
    def __init__(
        self,
        product_repository: ProductRepository,
        category_service: CategoryService,
        cloudinary_service: CloudinaryService,
        audit_service: AuditService | None = None,
    ):
        self.product_repository = product_repository
        self.category_service = category_service
        self.cloudinary_service = cloudinary_service
        self.audit_service = audit_service

    # -------------------------
    # GET ALL PRODUCTS
    # -------------------------
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
        status: str | None = None,
        seller_id: UUID | None = None,
        page: int = 1,
        page_size: int = 12,
    ):
        products, total, total_pages = self.product_repository.get_all_products(
            category=category,
            search=search,
            sort=sort,
            min_price=min_price,
            max_price=max_price,
            rating=rating,
            badge=badge,
            in_stock=in_stock,
            ids=ids,
            status=status,
            seller_id=seller_id,
            page=page,
            page_size=page_size,
        )

        return {
            "data": products,
            "meta": PaginationMeta(
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages,
            ).model_dump(),
        }

    # -------------------------
    # GET PRODUCT BY ID
    # -------------------------
    def get_product_by_id(self, product_id: UUID) -> Product:
        product = self.product_repository.get_product_by_id(product_id)

        if not product:
            raise AppException(
                message="Product not found",
                status_code=404,
                error_code="PRODUCT_NOT_FOUND",
            )

        return product

    # -------------------------
    # GET PRODUCT BY SLUG
    # -------------------------
    def get_product_by_slug(self, slug: str) -> Product:
        product = self.product_repository.get_product_by_slug(slug)

        if not product:
            raise AppException(
                message="Product not found",
                status_code=404,
                error_code="PRODUCT_NOT_FOUND",
            )

        return product

    # -------------------------
    # GET PRODUCTS BY IDS
    # -------------------------
    def get_products_by_ids(self, ids: list[UUID]) -> list[Product]:
        return self.product_repository.get_products_by_ids(ids)

    # -------------------------
    # GET RELATED PRODUCTS
    # -------------------------
    def get_related_products(self, product_id: UUID, limit: int = 4) -> list[Product]:
        self.get_product_by_id(product_id)
        return self.product_repository.get_related_products(product_id, limit)

    # -------------------------
    # CREATE PRODUCT
    # -------------------------
    def create_product(
        self,
        product: ProductCreate,
        seller: User,
        images: list[UploadFile] | None = None,
    ) -> Product:
        if seller.role not in (UserRole.SELLER, UserRole.ADMIN):
            raise AppException(
                message="Only sellers or admins can create products",
                status_code=403,
                error_code="FORBIDDEN",
            )

        self.category_service.get_category_by_id(product.category_id)

        image_urls = list(product.images or [])

        if images:
            for image in images:
                uploaded = self.cloudinary_service.upload_image(
                    image,
                    folder="farmeco/products",
                )
                image_urls.append(uploaded["url"])

        db_product = Product(
            **product.model_dump(
                exclude={"images", "badges"},
            ),
            slug=self._generate_unique_slug(product.name),
            seller_id=seller.id,
            images=image_urls,
            badges=[badge.value for badge in product.badges],
        )

        created = self.product_repository.create_product(db_product)
        self.category_service.recalculate_product_count(product.category_id)

        if self.audit_service:
            self.audit_service.record(
                actor=seller,
                action="CREATE",
                resource_type="product",
                resource_id=created.id,
                summary=f"Created product \"{created.name}\"",
                after={"name": created.name, "slug": created.slug, "price": float(created.price)},
            )

        return created

    # -------------------------
    # UPDATE PRODUCT
    # -------------------------
    def update_product(
        self,
        product_id: UUID,
        current_user: User,
        product: ProductUpdate,
        images: list[UploadFile] | None = None,
    ) -> Product:
        db_product = self.get_product_by_id(product_id)

        self._check_product_permission(db_product, current_user)

        updates = product.model_dump(exclude_unset=True)

        if "category_id" in updates:
            self.category_service.get_category_by_id(updates["category_id"])

        if "name" in updates and updates["name"] != db_product.name:
            updates["slug"] = self._generate_unique_slug(updates["name"])

        if "badges" in updates and updates["badges"] is not None:
            updates["badges"] = [badge.value for badge in updates["badges"]]

        if images:
            new_images = []
            for image in images:
                uploaded = self.cloudinary_service.upload_image(
                    image,
                    folder="farmeco/products",
                )
                new_images.append(uploaded["url"])
            updates["images"] = list(db_product.images or []) + new_images

        old_category_id = db_product.category_id

        for key, value in updates.items():
            setattr(db_product, key, value)

        updated = self.product_repository.update_product(db_product)

        if "category_id" in updates and updates["category_id"] != old_category_id:
            self.category_service.recalculate_product_count(old_category_id)
            self.category_service.recalculate_product_count(updates["category_id"])

        if self.audit_service:
            self.audit_service.record(
                actor=current_user,
                action="UPDATE",
                resource_type="product",
                resource_id=db_product.id,
                summary=f"Updated product \"{db_product.name}\"",
                after={"name": db_product.name, "price": float(db_product.price), "changes": list(updates.keys())},
            )

        return updated

    # -------------------------
    # DELETE PRODUCT
    # -------------------------
    def delete_product(self, product_id: UUID, current_user: User) -> Product:
        product = self.get_product_by_id(product_id)

        self._check_product_permission(product, current_user)

        deleted = self.product_repository.delete_product(product)
        self.category_service.recalculate_product_count(product.category_id)

        if self.audit_service:
            self.audit_service.record(
                actor=current_user,
                action="DELETE",
                resource_type="product",
                resource_id=product.id,
                summary=f"Deleted product \"{product.name}\"",
                before={"name": product.name, "slug": product.slug},
            )

        return deleted

    # -------------------------
    # HELPERS
    # -------------------------
    def _generate_unique_slug(self, title: str) -> str:
        base_slug = slugify(title)
        slug = base_slug
        counter = 1

        while self.product_repository.get_product_by_slug(slug):
            slug = f"{base_slug}-{counter}"
            counter += 1

        return slug

    def _check_product_permission(self, product: Product, current_user: User) -> None:
        if (
            product.seller_id != current_user.id
            and current_user.role != UserRole.ADMIN
        ):
            raise AppException(
                message="You are not authorized to perform this action",
                status_code=403,
                error_code="FORBIDDEN",
            )
