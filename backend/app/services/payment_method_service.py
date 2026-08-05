import re
from uuid import UUID

from app.models.payment_method import PaymentMethod
from app.repositories.payment_method_repository import PaymentMethodRepository
from app.schemas.account import PaymentMethodCreate


class PaymentMethodService:
    def __init__(self, repository: PaymentMethodRepository):
        self.repository = repository

    # -------------------------
    # GET PAYMENT METHODS
    # -------------------------
    def get_by_user(self, user_id: UUID) -> list[PaymentMethod]:
        return self.repository.get_by_user(user_id)

    # -------------------------
    # ADD PAYMENT METHOD
    # -------------------------
    def add(self, user_id: UUID, data: PaymentMethodCreate) -> PaymentMethod:
        digits = re.sub(r"\s+", "", data.number)
        last4 = digits[-4:]
        brand = "Visa" if digits.startswith("4") else "Mastercard"

        existing = self.repository.get_by_user(user_id)

        if data.is_default or not existing:
            self.repository.clear_defaults(user_id)
            is_default = True
        else:
            is_default = False

        method = PaymentMethod(
            user_id=user_id,
            brand=brand,
            last4=last4,
            expiry=data.expiry,
            is_default=is_default,
        )

        return self.repository.create_payment_method(method)
