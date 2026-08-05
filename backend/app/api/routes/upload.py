from fastapi import APIRouter, Depends, File, UploadFile, status

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.services import get_upload_service
from app.schemas.response import SuccessResponse
from app.schemas.upload import UploadedImageResponse
from app.services.upload_service import UploadService

router = APIRouter(dependencies=[Depends(get_current_user)])


@router.post(
    "/images",
    response_model=SuccessResponse[list[UploadedImageResponse]],
    status_code=status.HTTP_201_CREATED,
)
def upload_images(
    files: list[UploadFile] = File(...),
    upload_service: UploadService = Depends(get_upload_service),
):
    images = upload_service.upload_images(files, folder="farmeco/products")

    return SuccessResponse(
        message="Images uploaded successfully",
        data=[UploadedImageResponse(**image) for image in images],
    )


@router.post(
    "/image",
    response_model=SuccessResponse[UploadedImageResponse],
    status_code=status.HTTP_201_CREATED,
)
def upload_image(
    file: UploadFile = File(...),
    upload_service: UploadService = Depends(get_upload_service),
):
    image = upload_service.upload_image(file, folder="farmeco/products")

    return SuccessResponse(
        message="Image uploaded successfully",
        data=UploadedImageResponse(**image),
    )
