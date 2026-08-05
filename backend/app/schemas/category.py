from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CategoryBase(BaseModel):
    name: str
    slug: str | None = None
    short_description: str
    description: str
    image: str | None = None
    emoji: str | None = None
    accent: str | None = None
    featured: bool = False


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    short_description: str | None = None
    description: str | None = None
    image: str | None = None
    emoji: str | None = None
    accent: str | None = None
    featured: bool | None = None


class CategoryResponse(CategoryBase):
    id: UUID
    slug: str
    product_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
