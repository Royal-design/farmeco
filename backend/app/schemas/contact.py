from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.models.enums import ContactStatus


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    subject: str = Field(min_length=3)
    message: str = Field(min_length=10, max_length=2000)


class ContactMessageResponse(BaseModel):
    ticket: str
    created_at: datetime


class ContactMessageSummaryResponse(BaseModel):
    id: UUID
    ticket: str
    name: str
    email: str
    subject: str
    status: ContactStatus
    read_at: datetime | None
    replied_at: datetime | None
    user_read_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ContactMessageDetailResponse(ContactMessageSummaryResponse):
    user_id: UUID | None
    message: str
    admin_reply: str | None
    replied_by_name: str | None


class ContactReplyRequest(BaseModel):
    reply: str = Field(min_length=1, max_length=4000)


class NewsletterSubscribeRequest(BaseModel):
    email: EmailStr


class NewsletterResponse(BaseModel):
    subscribed: bool
