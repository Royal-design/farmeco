import random
from datetime import datetime, timezone
from uuid import UUID

from app.core.exceptions import AppException
from app.models.contact_message import ContactMessage
from app.models.enums import ContactStatus, NotificationType, UserRole
from app.models.newsletter_subscriber import NewsletterSubscriber
from app.models.user import User
from app.repositories.contact_repository import ContactRepository
from app.schemas.contact import (
    ContactMessageCreate,
    ContactMessageResponse,
    NewsletterResponse,
    NewsletterSubscribeRequest,
)
from app.schemas.user import PaginationMeta
from app.services.audit_service import AuditService
from app.services.email_service import EmailService
from app.services.notification_service import NotificationService


class ContactService:
    def __init__(
        self,
        repository: ContactRepository,
        email_service: EmailService | None = None,
        audit_service: AuditService | None = None,
        notification_service: NotificationService | None = None,
    ):
        self.repository = repository
        self.email_service = email_service
        self.audit_service = audit_service
        self.notification_service = notification_service

    # -------------------------
    # SEND MESSAGE
    # -------------------------
    def send_message(
        self,
        request: ContactMessageCreate,
        current_user: User | None = None,
    ) -> ContactMessageResponse:
        name = current_user.name if current_user else request.name
        email = str(current_user.email) if current_user else str(request.email)

        message = ContactMessage(
            name=name,
            email=email,
            subject=request.subject,
            message=request.message,
            ticket=self._generate_ticket(),
            user_id=current_user.id if current_user else None,
            status=ContactStatus.NEW,
        )

        created = self.repository.create_message(message)

        return ContactMessageResponse(
            ticket=created.ticket,
            created_at=created.created_at,
        )

    # -------------------------
    # GET MY MESSAGES
    # -------------------------
    def get_my_messages(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 10,
    ) -> dict:
        messages, total, total_pages = self.repository.get_messages_by_user(
            user_id,
            page=page,
            page_size=page_size,
        )

        return {
            "data": messages,
            "meta": PaginationMeta(
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages,
            ).model_dump(),
        }

    # -------------------------
    # GET ALL MESSAGES (ADMIN / SELLER)
    # -------------------------
    def get_all_messages(
        self,
        status: ContactStatus | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 15,
    ) -> dict:
        messages, total, total_pages = self.repository.get_all_messages(
            status=status,
            search=search,
            page=page,
            page_size=page_size,
        )

        return {
            "data": messages,
            "meta": PaginationMeta(
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages,
            ).model_dump(),
        }

    # -------------------------
    # GET MESSAGE BY ID
    # -------------------------
    def get_message_by_id(self, message_id: UUID, current_user: User) -> ContactMessage:
        message = self.repository.get_message_by_id(message_id)

        if not message:
            raise AppException(
                message="Message not found",
                status_code=404,
                error_code="MESSAGE_NOT_FOUND",
            )

        if not self._can_access_message(message, current_user):
            raise AppException(
                message="You are not authorized to view this message",
                status_code=403,
                error_code="FORBIDDEN",
            )

        if current_user.role in (UserRole.ADMIN, UserRole.SELLER):
            if message.status == ContactStatus.NEW and not message.read_at:
                message.status = ContactStatus.READ
                message.read_at = datetime.now(timezone.utc)
                message = self.repository.update_message(message)
        else:
            if message.status == ContactStatus.REPLIED and not message.user_read_at:
                message.user_read_at = datetime.now(timezone.utc)
                message = self.repository.update_message(message)

        return message

    # -------------------------
    # MARK AS READ (ADMIN / SELLER)
    # -------------------------
    def mark_as_read(self, message_id: UUID, current_user: User) -> ContactMessage:
        self._require_staff(current_user)
        message = self.repository.get_message_by_id(message_id)

        if not message:
            raise AppException(
                message="Message not found",
                status_code=404,
                error_code="MESSAGE_NOT_FOUND",
            )

        if message.status == ContactStatus.NEW:
            message.status = ContactStatus.READ
            message.read_at = datetime.now(timezone.utc)
            message = self.repository.update_message(message)

        return message

    # -------------------------
    # REPLY TO MESSAGE (ADMIN / SELLER)
    # -------------------------
    def reply_to_message(
        self,
        message_id: UUID,
        current_user: User,
        payload,
    ) -> ContactMessage:
        self._require_staff(current_user)
        message = self.repository.get_message_by_id(message_id)

        if not message:
            raise AppException(
                message="Message not found",
                status_code=404,
                error_code="MESSAGE_NOT_FOUND",
            )

        message.admin_reply = payload.reply
        message.status = ContactStatus.REPLIED
        message.read_at = message.read_at or datetime.now(timezone.utc)
        message.replied_at = datetime.now(timezone.utc)
        message.replied_by = current_user.id

        updated = self.repository.update_message(message)

        if self.email_service:
            try:
                self.email_service.send_message_reply_email(
                    email=message.email,
                    name=message.name,
                    ticket=message.ticket,
                    subject=message.subject,
                    reply=payload.reply,
                )
            except Exception:
                pass

        if self.audit_service:
            self.audit_service.record(
                actor=current_user,
                action="UPDATE",
                resource_type="contact_message",
                resource_id=message.id,
                summary=f"Replied to message {message.ticket} ({message.email})",
                after={"status": ContactStatus.REPLIED.value},
            )

        if self.notification_service and message.user_id:
            self.notification_service.notify(
                user_id=message.user_id,
                notification_type=NotificationType.MESSAGE,
                title="New reply to your message",
                body=f"\"{message.subject}\" — our team has responded.",
                link=f"/account/messages/{message.id}",
            )

        return updated

    # -------------------------
    # SUBSCRIBE NEWSLETTER
    # -------------------------
    def subscribe_newsletter(self, request: NewsletterSubscribeRequest) -> NewsletterResponse:
        email = str(request.email)

        subscriber = self.repository.get_subscriber_by_email(email)

        if subscriber:
            if not subscriber.is_active:
                subscriber.is_active = True
                self.repository.update_subscriber(subscriber)
            return NewsletterResponse(subscribed=True)

        self.repository.create_subscriber(
            NewsletterSubscriber(email=email, is_active=True)
        )

        return NewsletterResponse(subscribed=True)

    # -------------------------
    # HELPERS
    # -------------------------
    def _generate_ticket(self) -> str:
        while True:
            ticket = f"TS-{random.randint(10000, 99999)}"
            if not self.repository.get_message_by_ticket(ticket):
                return ticket

    def _require_staff(self, user: User) -> None:
        if user.role not in (UserRole.ADMIN, UserRole.SELLER):
            raise AppException(
                message="Admin or seller privileges required",
                status_code=403,
                error_code="FORBIDDEN",
            )

    def _can_access_message(self, message: ContactMessage, user: User) -> bool:
        if user.role in (UserRole.ADMIN, UserRole.SELLER):
            return True
        return message.user_id == user.id
