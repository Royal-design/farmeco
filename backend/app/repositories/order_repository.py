from math import ceil
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.enums import OrderStatus
from app.models.order import Order


class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def _query(self):
        return self.db.query(Order)

    def get_order_by_id(self, order_id: UUID) -> Order | None:
        return self._query().filter(Order.id == order_id).first()

    def get_order_by_number(self, number: str) -> Order | None:
        return self._query().filter(Order.number == number).first()

    def get_orders_by_user(
        self,
        user_id: UUID,
        status: OrderStatus | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 10,
    ) -> tuple[list[Order], int]:
        query = self._query().filter(Order.user_id == user_id)

        if status:
            query = query.filter(Order.status == status)

        if search:
            query = query.filter(Order.number.ilike(f"%{search}%"))

        total = query.count()

        offset = (page - 1) * page_size
        orders = (
            query
            .order_by(Order.created_at.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        return orders, total

    def get_recent_orders(self, user_id: UUID, limit: int = 4) -> list[Order]:
        return (
            self._query()
            .filter(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
            .limit(limit)
            .all()
        )

    def get_all_orders(
        self,
        status: OrderStatus | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 10,
    ) -> tuple[list[Order], int, int]:
        query = self._query()

        if status:
            query = query.filter(Order.status == status)

        if search:
            query = query.filter(Order.number.ilike(f"%{search}%"))

        total = query.count()

        offset = (page - 1) * page_size
        orders = (
            query
            .order_by(Order.created_at.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        total_pages = ceil(total / page_size) if page_size else 0
        return orders, total, total_pages

    def create_order(self, order: Order) -> Order:
        self.db.add(order)
        self.db.commit()
        return self.get_order_by_id(order.id)

    def update_order(self, order: Order) -> Order:
        self.db.commit()
        self.db.refresh(order)
        return order
