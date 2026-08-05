from datetime import datetime, timezone
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, Float, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import ProductStatus

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.review import Review
    from app.models.user import User


class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    short_description: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=False,
    )
    seller_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
    )

    price: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    compare_at_price: Mapped[float | None] = mapped_column(Numeric(14, 2))
    currency: Mapped[str] = mapped_column(String, default="NGN", nullable=False)
    unit: Mapped[str] = mapped_column(String, default="head", nullable=False)

    stock: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    sold: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    rating: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    review_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    images: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    specs: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    tags: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    badges: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)

    origin: Mapped[str | None] = mapped_column(String)
    farm: Mapped[str | None] = mapped_column(String)

    status: Mapped[ProductStatus] = mapped_column(SAEnum(ProductStatus), nullable=False, default=ProductStatus.PUBLISHED)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    category: Mapped["Category"] = relationship(back_populates="products")
    seller: Mapped["User | None"] = relationship(back_populates="products")
    reviews: Mapped[list["Review"]] = relationship(back_populates="product", cascade="all, delete-orphan")
