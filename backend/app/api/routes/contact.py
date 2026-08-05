from fastapi import APIRouter, Depends, status

from app.api.dependencies.services import get_contact_service
from app.schemas.contact import (
    ContactMessageCreate,
    ContactMessageResponse,
    NewsletterResponse,
    NewsletterSubscribeRequest,
)
from app.services.contact_service import ContactService

router = APIRouter()


# -------------------------
# SEND CONTACT MESSAGE
# -------------------------
@router.post(
    "/messages",
    response_model=ContactMessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def send_message(
    payload: ContactMessageCreate,
    contact_service: ContactService = Depends(get_contact_service),
):
    return contact_service.send_message(payload)


# -------------------------
# SUBSCRIBE TO NEWSLETTER
# -------------------------
@router.post(
    "/newsletter/subscribe",
    response_model=NewsletterResponse,
    status_code=status.HTTP_201_CREATED,
)
def subscribe_newsletter(
    payload: NewsletterSubscribeRequest,
    contact_service: ContactService = Depends(get_contact_service),
):
    return contact_service.subscribe_newsletter(payload)
