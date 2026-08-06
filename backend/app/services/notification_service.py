from uuid import UUID

from app.models.enums import NotificationType
from app.models.notification import Notification
from app.models.user import User
from app.repositories.notification_repository import NotificationRepository
from app.schemas.user import PaginationMeta


class NotificationService:
    def __init__(self, repository: NotificationRepository):
        self.repository = repository

    # -------------------------
    # CREATE NOTIFICATION
    # -------------------------
    def notify(
        self,
        user_id: UUID,
        notification_type: NotificationType,
        title: str,
        body: str | None = None,
        link: str | None = None,
    ) -> Notification:
        notification = Notification(
            user_id=user_id,
            type=notification_type,
            title=title,
            body=body,
            link=link,
        )
        return self.repository.create(notification)

    # -------------------------
    # GET MY NOTIFICATIONS
    # -------------------------
    def get_my_notifications(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 20,
    ) -> dict:
        notifications, total, total_pages = self.repository.get_by_user(
            user_id,
            page=page,
            page_size=page_size,
        )

        return {
            "data": notifications,
            "meta": PaginationMeta(
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages,
            ).model_dump(),
        }

    # -------------------------
    # UNREAD COUNT
    # -------------------------
    def unread_count(self, user_id: UUID) -> int:
        return self.repository.unread_count(user_id)

    # -------------------------
    # MARK READ
    # -------------------------
    def mark_read(self, notification_id: UUID, user: User) -> Notification:
        notification = self.repository.get_by_id(notification_id, user.id)

        if not notification:
            from app.core.exceptions import AppException
            raise AppException(
                message="Notification not found",
                status_code=404,
                error_code="NOTIFICATION_NOT_FOUND",
            )

        return self.repository.mark_read(notification)

    # -------------------------
    # MARK ALL READ
    # -------------------------
    def mark_all_read(self, user_id: UUID) -> int:
        return self.repository.mark_all_read(user_id)
