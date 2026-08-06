from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class AuditLogResponse(BaseModel):
    id: UUID
    actor_id: UUID | None
    actor_email: str | None
    actor_name: str | None
    action: str
    resource_type: str
    resource_id: str | None
    summary: str
    before_data: dict | None
    after_data: dict | None
    ip_address: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
