from uuid import UUID

from sqlalchemy.orm import Session

from app.models.payment_method import PaymentMethod


class PaymentMethodRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user(self, user_id: UUID) -> list[PaymentMethod]:
        return (
            self.db.query(PaymentMethod)
            .filter(PaymentMethod.user_id == user_id)
            .order_by(PaymentMethod.is_default.desc(), PaymentMethod.created_at.desc())
            .all()
        )

    def create_payment_method(self, payment_method: PaymentMethod) -> PaymentMethod:
        self.db.add(payment_method)
        self.db.commit()
        self.db.refresh(payment_method)
        return payment_method

    def update_payment_method(self, payment_method: PaymentMethod) -> PaymentMethod:
        self.db.commit()
        self.db.refresh(payment_method)
        return payment_method

    def clear_defaults(self, user_id: UUID) -> None:
        for method in self.get_by_user(user_id):
            if method.is_default:
                method.is_default = False
        self.db.commit()
