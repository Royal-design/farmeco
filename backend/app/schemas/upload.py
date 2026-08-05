from pydantic import BaseModel


class UploadedImageResponse(BaseModel):
    url: str
    public_id: str
