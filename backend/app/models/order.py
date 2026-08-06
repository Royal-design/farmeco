from datetime import datetime, timezone
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import OrderStatus, PaymentMethod, PaymentStatus

if TYPE_CHECKING:
    from app.models.user import User


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    number: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    status: Mapped[OrderStatus] = mapped_column(SAEnum(OrderStatus), nullable=False, default=OrderStatus.PENDING)

    items: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    shipping_address: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)

    subtotal: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    shipping: Mapped[float] = mapped_column(Numeric(14, 2), default=0, nullable=False)
    tax: Mapped[float] = mapped_column(Numeric(14, 2), default=0, nullable=False)
    discount: Mapped[float] = mapped_column(Numeric(14, 2), default=0, nullable=False)
    total: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)

    payment_method: Mapped[PaymentMethod] = mapped_column(SAEnum(PaymentMethod), nullable=False)
    coupon_code: Mapped[str | None] = mapped_column(String)

    payment_status: Mapped[PaymentStatus] = mapped_column(
        SAEnum(PaymentStatus), nullable=False, default=PaymentStatus.UNPAID
    )
    payment_reference: Mapped[str | None] = mapped_column(String)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime)

    notes: Mapped[str | None] = mapped_column(Text)
    eta: Mapped[str | None] = mapped_column(String)
    status_history: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="orders")
