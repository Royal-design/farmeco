from datetime import datetime, timezone
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import ContactStatus

if TYPE_CHECKING:
    from app.models.user import User


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    subject: Mapped[str] = mapped_column(String, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    ticket: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
    )

    status: Mapped[ContactStatus] = mapped_column(
        SAEnum(ContactStatus), nullable=False, default=ContactStatus.NEW
    )
    read_at: Mapped[datetime | None] = mapped_column(DateTime)
    user_read_at: Mapped[datetime | None] = mapped_column(DateTime)

    admin_reply: Mapped[str | None] = mapped_column(Text)
    replied_at: Mapped[datetime | None] = mapped_column(DateTime)
    replied_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
    )

    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user: Mapped["User | None"] = relationship(foreign_keys=[user_id])
    replier: Mapped["User | None"] = relationship(foreign_keys=[replied_by])

    @property
    def replied_by_name(self) -> str | None:
        return self.replier.name if self.replier else None
