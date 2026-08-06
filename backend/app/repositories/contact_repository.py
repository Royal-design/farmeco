from math import ceil
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.contact_message import ContactMessage
from app.models.enums import ContactStatus
from app.models.newsletter_subscriber import NewsletterSubscriber


class ContactRepository:
    def __init__(self, db: Session):
        self.db = db

    # -------------------------
    # MESSAGES
    # -------------------------
    def create_message(self, message: ContactMessage) -> ContactMessage:
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message

    def get_message_by_ticket(self, ticket: str) -> ContactMessage | None:
        return (
            self.db.query(ContactMessage)
            .filter(ContactMessage.ticket == ticket)
            .first()
        )

    def get_message_by_id(self, message_id: UUID) -> ContactMessage | None:
        return (
            self.db.query(ContactMessage)
            .filter(ContactMessage.id == message_id)
            .first()
        )

    def update_message(self, message: ContactMessage) -> ContactMessage:
        self.db.commit()
        self.db.refresh(message)
        return message

    def get_messages_by_user(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 10,
    ) -> tuple[list[ContactMessage], int, int]:
        query = self.db.query(ContactMessage).filter(ContactMessage.user_id == user_id)

        total = query.count()

        offset = (page - 1) * page_size
        messages = (
            query
            .order_by(ContactMessage.created_at.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        total_pages = ceil(total / page_size) if page_size else 0
        return messages, total, total_pages

    def get_all_messages(
        self,
        status: ContactStatus | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 15,
    ) -> tuple[list[ContactMessage], int, int]:
        query = self.db.query(ContactMessage)

        if status:
            query = query.filter(ContactMessage.status == status)

        if search:
            query = query.filter(
                ContactMessage.subject.ilike(f"%{search}%")
                | ContactMessage.email.ilike(f"%{search}%")
                | ContactMessage.ticket.ilike(f"%{search}%")
            )

        total = query.count()

        offset = (page - 1) * page_size
        messages = (
            query
            .order_by(ContactMessage.created_at.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        total_pages = ceil(total / page_size) if page_size else 0
        return messages, total, total_pages

    # -------------------------
    # NEWSLETTER
    # -------------------------
    def get_subscriber_by_email(self, email: str) -> NewsletterSubscriber | None:
        return (
            self.db.query(NewsletterSubscriber)
            .filter(NewsletterSubscriber.email == email)
            .first()
        )

    def create_subscriber(self, subscriber: NewsletterSubscriber) -> NewsletterSubscriber:
        self.db.add(subscriber)
        self.db.commit()
        self.db.refresh(subscriber)
        return subscriber

    def update_subscriber(self, subscriber: NewsletterSubscriber) -> NewsletterSubscriber:
        self.db.commit()
        self.db.refresh(subscriber)
        return subscriber
