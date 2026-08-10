import csv
import io
from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile, status
from fastapi.responses import StreamingResponse

from app.api.dependencies.auth import get_current_admin_user, get_current_user
from app.api.dependencies.services import get_bulk_import_service
from app.models.user import User
from app.schemas.bulk import BulkImportReport
from app.schemas.response import SuccessResponse
from app.services.bulk_import_service import BulkImportService

router = APIRouter(dependencies=[Depends(get_current_admin_user)])

TEMPLATES: dict[str, tuple[str, list[str]]] = {
    "products": (
        "product",
        [
            "name",
            "short_description",
            "description",
            "category",
            "price",
            "compare_at_price",
            "currency",
            "unit",
            "stock",
            "origin",
            "farm",
            "cover_image",
            "image2",
            "image3",
            "tags",
            "badges",
            "specs",
            "status",
        ],
    ),
    "categories": (
        "category",
        ["name", "slug", "short_description", "description", "image", "emoji", "accent", "featured"],
    ),
    "coupons": (
        "coupon",
        ["code", "type", "value", "min_order", "description", "expires_at"],
    ),
    "blog-posts": (
        "blog-post",
        ["title", "excerpt", "content", "category", "tags", "featured", "cover_image", "image2", "image3"],
    ),
}


def _csv_response(filename: str, headers: list[str]) -> StreamingResponse:
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(headers)
    buffer.seek(0)
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}.csv"'},
    )


# -------------------------
# TEMPLATES
# -------------------------
@router.get("/templates/{entity}")
def download_template(entity: str):
    template = TEMPLATES.get(entity)
    if not template:
        return SuccessResponse(
            message="Template not found",
            data=None,
        )
    filename, headers = template
    return _csv_response(filename, headers)


# -------------------------
# IMPORT PRODUCTS
# -------------------------
@router.post(
    "/import/products",
    response_model=SuccessResponse[BulkImportReport],
    status_code=status.HTTP_201_CREATED,
)
def import_products(
    file: UploadFile = File(...),
    current_user: Annotated[User, Depends(get_current_user)] = ...,
    bulk_service: BulkImportService = Depends(get_bulk_import_service),
):
    report = bulk_service.import_products(file, current_user)
    return SuccessResponse(
        message="Product import finished",
        data=report,
    )


# -------------------------
# IMPORT CATEGORIES
# -------------------------
@router.post(
    "/import/categories",
    response_model=SuccessResponse[BulkImportReport],
    status_code=status.HTTP_201_CREATED,
)
def import_categories(
    file: UploadFile = File(...),
    current_user: Annotated[User, Depends(get_current_user)] = ...,
    bulk_service: BulkImportService = Depends(get_bulk_import_service),
):
    report = bulk_service.import_categories(file, current_user)
    return SuccessResponse(
        message="Category import finished",
        data=report,
    )


# -------------------------
# IMPORT COUPONS
# -------------------------
@router.post(
    "/import/coupons",
    response_model=SuccessResponse[BulkImportReport],
    status_code=status.HTTP_201_CREATED,
)
def import_coupons(
    file: UploadFile = File(...),
    current_user: Annotated[User, Depends(get_current_user)] = ...,
    bulk_service: BulkImportService = Depends(get_bulk_import_service),
):
    report = bulk_service.import_coupons(file, current_user)
    return SuccessResponse(
        message="Coupon import finished",
        data=report,
    )


# -------------------------
# IMPORT BLOG POSTS
# -------------------------
@router.post(
    "/import/blog-posts",
    response_model=SuccessResponse[BulkImportReport],
    status_code=status.HTTP_201_CREATED,
)
def import_blog_posts(
    file: UploadFile = File(...),
    current_user: Annotated[User, Depends(get_current_user)] = ...,
    bulk_service: BulkImportService = Depends(get_bulk_import_service),
):
    report = bulk_service.import_blog_posts(file, current_user)
    return SuccessResponse(
        message="Blog import finished",
        data=report,
    )
