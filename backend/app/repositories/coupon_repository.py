from uuid import UUID

from sqlalchemy.orm import Session

from app.models.coupon import Coupon


class CouponRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, active_only: bool = True) -> list[Coupon]:
        query = self.db.query(Coupon)
        if active_only:
            query = query.filter(Coupon.is_active == True)
        return query.order_by(Coupon.created_at.desc()).all()

    def get_by_id(self, coupon_id: UUID) -> Coupon | None:
        return self.db.query(Coupon).filter(Coupon.id == coupon_id).first()

    def get_by_code(self, code: str) -> Coupon | None:
        return (
            self.db.query(Coupon)
            .filter(Coupon.code.ilike(code))
            .first()
        )

    def create_coupon(self, coupon: Coupon) -> Coupon:
        self.db.add(coupon)
        self.db.commit()
        self.db.refresh(coupon)
        return coupon

    def update_coupon(self, coupon: Coupon) -> Coupon:
        self.db.commit()
        self.db.refresh(coupon)
        return coupon

    def delete_coupon(self, coupon: Coupon) -> Coupon:
        self.db.delete(coupon)
        self.db.commit()
        return coupon
