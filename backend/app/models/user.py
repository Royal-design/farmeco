from datetime import datetime, timezone
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import AuthProvider, UserRole

if TYPE_CHECKING:
    from app.models.blog_post import BlogPost
    from app.models.notification import Notification
    from app.models.order import Order
    from app.models.payment_method import PaymentMethod
    from app.models.product import Product
    from app.models.refresh_token import RefreshToken
    from app.models.review import Review

DEFAULT_PREFERENCES = {
    "notifications": True,
    "marketing": False,
    "currency": "NGN",
    "order_updates": True,
    "price_drops": True,
    "new_arrivals": False,
    "weekly_digest": True,
}


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String)
    password: Mapped[str] = mapped_column(Text, nullable=False)

    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), nullable=False, default=UserRole.BUYER)
    provider: Mapped[AuthProvider] = mapped_column(SAEnum(AuthProvider), nullable=False, default=AuthProvider.CREDENTIALS)

    avatar: Mapped[str | None] = mapped_column(Text)
    avatar_public_id: Mapped[str | None] = mapped_column(String)

    address: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    preferences: Mapped[dict] = mapped_column(JSONB, default=lambda: DEFAULT_PREFERENCES.copy(), nullable=False)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    two_factor_enabled: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    orders: Mapped[list["Order"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    products: Mapped[list["Product"]] = relationship(back_populates="seller", cascade="all, delete-orphan")
    reviews: Mapped[list["Review"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    blog_posts: Mapped[list["BlogPost"]] = relationship(back_populates="author_user", passive_deletes=True)
    payment_methods: Mapped[list["PaymentMethod"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    notifications: Mapped[list["Notification"]] = relationship(back_populates="user", cascade="all, delete-orphan")
