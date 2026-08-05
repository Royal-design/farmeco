from datetime import datetime, timezone
import uuid

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.enums import CouponType


class Coupon(Base):
    __tablename__ = "coupons"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    code: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    type: Mapped[CouponType] = mapped_column(SAEnum(CouponType), nullable=False)
    value: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    min_order: Mapped[float] = mapped_column(Numeric(14, 2), default=0, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
