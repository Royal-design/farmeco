from fastapi import UploadFile

from app.core.exceptions import AppException
from app.services.cloudinary_service import CloudinaryService


class UploadService:
    def __init__(self, cloudinary_service: CloudinaryService):
        self.cloudinary_service = cloudinary_service

    def upload_images(
        self,
        files: list[UploadFile],
        folder: str = "farmeco",
    ) -> list[dict]:
        if not files:
            raise AppException(
                message="No files provided",
                status_code=400,
                error_code="NO_FILES",
            )

        uploaded = []
        for file in files:
            if not file.filename:
                continue
            uploaded.append(
                self.cloudinary_service.upload_image(file, folder=folder)
            )

        if not uploaded:
            raise AppException(
                message="No valid images provided",
                status_code=400,
                error_code="NO_VALID_FILES",
            )

        return uploaded

    def upload_image(
        self,
        file: UploadFile,
        folder: str = "farmeco",
    ) -> dict:
        return self.cloudinary_service.upload_image(file, folder=folder)
