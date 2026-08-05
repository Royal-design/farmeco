import random

from app.core.exceptions import AppException
from app.models.contact_message import ContactMessage
from app.models.newsletter_subscriber import NewsletterSubscriber
from app.repositories.contact_repository import ContactRepository
from app.schemas.contact import (
    ContactMessageCreate,
    ContactMessageResponse,
    NewsletterResponse,
    NewsletterSubscribeRequest,
)


class ContactService:
    def __init__(self, repository: ContactRepository):
        self.repository = repository

    # -------------------------
    # SEND MESSAGE
    # -------------------------
    def send_message(self, request: ContactMessageCreate) -> ContactMessageResponse:
        message = ContactMessage(
            name=request.name,
            email=str(request.email),
            subject=request.subject,
            message=request.message,
            ticket=self._generate_ticket(),
        )

        created = self.repository.create_message(message)

        return ContactMessageResponse(
            ticket=created.ticket,
            created_at=created.created_at,
        )

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
