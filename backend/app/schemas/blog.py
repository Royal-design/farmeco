from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BlogPostBase(BaseModel):
    title: str = Field(min_length=5, max_length=160)
    excerpt: str = Field(min_length=20)
    content: list[str] = Field(min_length=1)
    category: str
    tags: list[str] = Field(default_factory=list)
    featured: bool = False
    cover_image: str | None = None
    images: list[str] = Field(default_factory=list)


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=5, max_length=160)
    excerpt: str | None = Field(default=None, min_length=20)
    content: list[str] | None = Field(default=None, min_length=1)
    category: str | None = None
    tags: list[str] | None = None
    featured: bool | None = None
    cover_image: str | None = None
    images: list[str] | None = None


class BlogPostAuthorResponse(BaseModel):
    name: str
    role: str | None = None
    avatar: str | None = None


class BlogPostResponse(BlogPostBase):
    id: UUID
    slug: str
    read_time: int
    published_at: datetime
    created_at: datetime
    author: BlogPostAuthorResponse

    model_config = ConfigDict(from_attributes=True)
