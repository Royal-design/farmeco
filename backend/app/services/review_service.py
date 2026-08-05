from uuid import UUID

from app.core.exceptions import AppException
from app.models.review import Review
from app.models.user import User
from app.repositories.product_repository import ProductRepository
from app.repositories.review_repository import ReviewRepository
from app.schemas.review import ReviewCreate


class ReviewService:
    def __init__(
        self,
        review_repository: ReviewRepository,
        product_repository: ProductRepository,
    ):
        self.review_repository = review_repository
        self.product_repository = product_repository

    # -------------------------
    # GET REVIEWS BY PRODUCT
    # -------------------------
    def get_reviews_by_product(
        self,
        product_id: UUID,
        page: int = 1,
        page_size: int = 10,
    ):
        product = self.product_repository.get_product_by_id(product_id)
        if not product:
            raise AppException(
                message="Product not found",
                status_code=404,
                error_code="PRODUCT_NOT_FOUND",
            )

        reviews, total = self.review_repository.get_reviews_by_product(
            product_id,
            page=page,
            page_size=page_size,
        )

        from math import ceil

        return {
            "data": reviews,
            "meta": {
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": ceil(total / page_size) if page_size else 0,
            },
        }

    # -------------------------
    # CREATE REVIEW
    # -------------------------
    def create_review(self, user: User, request: ReviewCreate) -> Review:
        product = self.product_repository.get_product_by_id(request.product_id)

        if not product:
            raise AppException(
                message="Product not found",
                status_code=404,
                error_code="PRODUCT_NOT_FOUND",
            )

        existing = self.review_repository.get_review_by_product_and_user(
            request.product_id,
            user.id,
        )
        if existing:
            raise AppException(
                message="You have already reviewed this product",
                status_code=409,
                error_code="REVIEW_ALREADY_EXISTS",
            )

        db_review = Review(
            product_id=request.product_id,
            user_id=user.id,
            rating=request.rating,
            title=request.title,
            comment=request.comment,
        )

        created = self.review_repository.create_review(db_review)
        self._recompute_rating(request.product_id)

        return created

    # -------------------------
    # DELETE REVIEW
    # -------------------------
    def delete_review(self, review_id: UUID, current_user: User) -> Review:
        review = self.review_repository.get_review_by_id(review_id)

        if not review:
            raise AppException(
                message="Review not found",
                status_code=404,
                error_code="REVIEW_NOT_FOUND",
            )

        if review.user_id != current_user.id and current_user.role != "admin":
            raise AppException(
                message="You are not authorized to perform this action",
                status_code=403,
                error_code="FORBIDDEN",
            )

        product_id = review.product_id
        deleted = self.review_repository.delete_review(review)
        self._recompute_rating(product_id)

        return deleted

    # -------------------------
    # MARK HELPFUL
    # -------------------------
    def mark_helpful(self, review_id: UUID) -> Review:
        review = self.review_repository.get_review_by_id(review_id)

        if not review:
            raise AppException(
                message="Review not found",
                status_code=404,
                error_code="REVIEW_NOT_FOUND",
            )

        return self.review_repository.increment_helpful(review)

    # -------------------------
    # HELPERS
    # -------------------------
    def _recompute_rating(self, product_id: UUID) -> None:
        average, count = self.review_repository.get_rating_stats(product_id)
        product = self.product_repository.get_product_by_id(product_id)
        if product:
            product.rating = round(average, 2)
            product.review_count = count
            self.product_repository.db.commit()
