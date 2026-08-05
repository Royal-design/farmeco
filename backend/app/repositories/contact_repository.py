from sqlalchemy.orm import Session

from app.models.contact_message import ContactMessage
from app.models.newsletter_subscriber import NewsletterSubscriber


class ContactRepository:
    def __init__(self, db: Session):
        self.db = db

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
