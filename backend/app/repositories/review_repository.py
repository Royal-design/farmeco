from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.models.review import Review


class ReviewRepository:
    def __init__(self, db: Session):
        self.db = db

    def _query(self):
        return self.db.query(Review).options(selectinload(Review.user))

    def get_reviews_by_product(
        self,
        product_id: UUID,
        page: int = 1,
        page_size: int = 10,
    ) -> tuple[list[Review], int]:
        query = self._query().filter(Review.product_id == product_id)
        total = query.count()

        offset = (page - 1) * page_size
        reviews = (
            query
            .order_by(Review.created_at.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        return reviews, total

    def get_review_by_id(self, review_id: UUID) -> Review | None:
        return self._query().filter(Review.id == review_id).first()

    def get_review_by_product_and_user(
        self,
        product_id: UUID,
        user_id: UUID,
    ) -> Review | None:
        return (
            self._query()
            .filter(Review.product_id == product_id, Review.user_id == user_id)
            .first()
        )

    def create_review(self, review: Review) -> Review:
        self.db.add(review)
        self.db.commit()
        return self.get_review_by_id(review.id)

    def delete_review(self, review: Review) -> Review:
        self.db.delete(review)
        self.db.commit()
        return review

    def increment_helpful(self, review: Review) -> Review:
        review.helpful_count += 1
        self.db.commit()
        self.db.refresh(review)
        return review

    def get_rating_stats(self, product_id: UUID) -> tuple[float, int]:
        row = (
            self.db.query(func.avg(Review.rating), func.count(Review.id))
            .filter(Review.product_id == product_id)
            .first()
        )
        average = float(row[0]) if row and row[0] is not None else 0.0
        count = int(row[1]) if row else 0
        return average, count
