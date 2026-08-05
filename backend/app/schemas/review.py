from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ReviewCreate(BaseModel):
    product_id: UUID
    rating: int = Field(ge=1, le=5)
    title: str = Field(min_length=3, max_length=80)
    comment: str = Field(min_length=10, max_length=1000)


class ReviewResponse(BaseModel):
    id: UUID
    product_id: UUID
    author: str
    author_initials: str
    rating: int
    title: str
    comment: str
    helpful_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
