from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import ProductBadge, ProductStatus


class ProductBase(BaseModel):
    name: str = Field(min_length=3, max_length=120)
    short_description: str = Field(min_length=10, max_length=180)
    description: str = Field(min_length=30)
    category_id: UUID
    price: float = Field(gt=0)
    compare_at_price: float | None = None
    currency: str = "NGN"
    unit: str = "head"
    stock: int = Field(default=0, ge=0)
    origin: str | None = None
    farm: str | None = None
    images: list[str] = Field(default_factory=list)
    specs: list[dict] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    badges: list[ProductBadge] = Field(default_factory=list)
    status: ProductStatus = ProductStatus.PUBLISHED

    @field_validator("badges")
    @classmethod
    def dedupe_badges(cls, value: list[ProductBadge]) -> list[ProductBadge]:
        return list(dict.fromkeys(value))


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=3, max_length=120)
    short_description: str | None = Field(default=None, min_length=10, max_length=180)
    description: str | None = Field(default=None, min_length=30)
    category_id: UUID | None = None
    price: float | None = Field(default=None, gt=0)
    compare_at_price: float | None = None
    currency: str | None = None
    unit: str | None = None
    stock: int | None = Field(default=None, ge=0)
    origin: str | None = None
    farm: str | None = None
    images: list[str] | None = None
    specs: list[dict] | None = None
    tags: list[str] | None = None
    badges: list[ProductBadge] | None = None
    status: ProductStatus | None = None

    @field_validator("badges")
    @classmethod
    def dedupe_badges(cls, value: list[ProductBadge] | None) -> list[ProductBadge] | None:
        if value is None:
            return value
        return list(dict.fromkeys(value))


class ProductReviewResponse(BaseModel):
    id: UUID
    author: str
    author_initials: str
    rating: int
    title: str
    comment: str
    helpful_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductCategoryResponse(BaseModel):
    id: UUID
    name: str
    slug: str

    model_config = ConfigDict(from_attributes=True)


class ProductSummaryResponse(BaseModel):
    id: UUID
    slug: str
    name: str
    short_description: str
    description: str
    category_id: UUID
    price: float
    compare_at_price: float | None
    currency: str
    unit: str
    stock: int
    sold: int
    rating: float
    review_count: int
    images: list[str]
    specs: list[dict]
    tags: list[str]
    badges: list[str]
    origin: str | None
    farm: str | None
    status: ProductStatus
    is_active: bool
    category: ProductCategoryResponse | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductResponse(ProductSummaryResponse):
    reviews: list[ProductReviewResponse] = Field(default_factory=list)
