from datetime import datetime, timezone
import uuid

from sqlalchemy import DateTime, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ShippingSetting(Base):
    __tablename__ = "shipping_settings"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)

    free_shipping_threshold: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    flat_rate: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
