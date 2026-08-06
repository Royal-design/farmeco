from math import ceil
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, notification: Notification) -> Notification:
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification

    def get_by_user(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[Notification], int, int]:
        query = self.db.query(Notification).filter(Notification.user_id == user_id)

        total = query.count()

        offset = (page - 1) * page_size
        notifications = (
            query
            .order_by(Notification.created_at.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        total_pages = ceil(total / page_size) if page_size else 0
        return notifications, total, total_pages

    def get_by_id(self, notification_id: UUID, user_id: UUID) -> Notification | None:
        return (
            self.db.query(Notification)
            .filter(Notification.id == notification_id, Notification.user_id == user_id)
            .first()
        )

    def unread_count(self, user_id: UUID) -> int:
        return (
            self.db.query(Notification)
            .filter(Notification.user_id == user_id, Notification.is_read.is_(False))
            .count()
        )

    def mark_read(self, notification: Notification) -> Notification:
        notification.is_read = True
        self.db.commit()
        self.db.refresh(notification)
        return notification

    def mark_all_read(self, user_id: UUID) -> int:
        updated = (
            self.db.query(Notification)
            .filter(Notification.user_id == user_id, Notification.is_read.is_(False))
            .update({Notification.is_read: True}, synchronize_session=False)
        )
        self.db.commit()
        return updated
