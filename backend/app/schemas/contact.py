from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    subject: str = Field(min_length=3)
    message: str = Field(min_length=10, max_length=2000)


class ContactMessageResponse(BaseModel):
    ticket: str
    created_at: datetime


class NewsletterSubscribeRequest(BaseModel):
    email: EmailStr


class NewsletterResponse(BaseModel):
    subscribed: bool
