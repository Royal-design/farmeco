from pydantic import BaseModel


class BulkImportError(BaseModel):
    row: int
    error: str


class BulkImportReport(BaseModel):
    total: int
    imported: int
    failed: int
    errors: list[BulkImportError] = []
