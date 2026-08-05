from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.services import get_review_service
from app.models.user import User
from app.schemas.response import MessageResponse, SuccessResponse
from app.schemas.review import ReviewCreate, ReviewResponse
from app.services.review_service import ReviewService

router = APIRouter()


# -------------------------
# GET REVIEWS BY PRODUCT
# -------------------------
@router.get("/product/{product_id}", response_model=SuccessResponse[list[ReviewResponse]])
def get_reviews(
    product_id: UUID,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    review_service: ReviewService = Depends(get_review_service),
):
    result = review_service.get_reviews_by_product(
        product_id,
        page=page,
        page_size=page_size,
    )

    return SuccessResponse(
        message="Reviews retrieved successfully",
        data=result["data"],
        meta=result["meta"],
    )


# -------------------------
# CREATE REVIEW
# -------------------------
@router.post(
    "",
    response_model=SuccessResponse[ReviewResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_review(
    payload: ReviewCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    review_service: ReviewService = Depends(get_review_service),
):
    review = review_service.create_review(current_user, payload)

    return SuccessResponse(
        message="Review submitted successfully",
        data=review,
    )


# -------------------------
# MARK REVIEW AS HELPFUL
# -------------------------
@router.post("/{review_id}/helpful", response_model=SuccessResponse[ReviewResponse])
def mark_helpful(
    review_id: UUID,
    review_service: ReviewService = Depends(get_review_service),
):
    review = review_service.mark_helpful(review_id)

    return SuccessResponse(
        message="Review marked as helpful",
        data=review,
    )


# -------------------------
# DELETE REVIEW
# -------------------------
@router.delete("/{review_id}", response_model=MessageResponse)
def delete_review(
    review_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    review_service: ReviewService = Depends(get_review_service),
):
    review_service.delete_review(review_id, current_user)

    return MessageResponse(message="Review deleted successfully")
