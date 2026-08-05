from datetime import datetime, timezone
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    excerpt: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)

    cover_image: Mapped[str | None] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String, nullable=False)
    tags: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    read_time: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    author_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
    )
    author_name: Mapped[str] = mapped_column(String, nullable=False)
    author_role: Mapped[str | None] = mapped_column(String)
    author_avatar: Mapped[str | None] = mapped_column(Text)

    published_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    author_user: Mapped["User | None"] = relationship(back_populates="blog_posts")

    @property
    def author(self) -> dict:
        return {
            "name": self.author_name,
            "role": self.author_role,
            "avatar": self.author_avatar,
        }
