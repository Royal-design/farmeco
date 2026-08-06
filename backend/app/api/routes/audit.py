from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.api.dependencies.auth import get_current_admin_user
from app.api.dependencies.services import get_audit_service
from app.models.user import User
from app.schemas.audit import AuditLogResponse
from app.schemas.response import SuccessResponse
from app.services.audit_service import AuditService

router = APIRouter()


# -------------------------
# GET AUDIT LOGS (ADMIN)
# -------------------------
@router.get("", response_model=SuccessResponse[list[AuditLogResponse]])
def get_audit_logs(
    current_admin: Annotated[User, Depends(get_current_admin_user)],
    audit_service: Annotated[AuditService, Depends(get_audit_service)],
    resource_type: str | None = Query(None),
    action: str | None = Query(None),
    actor_email: str | None = Query(None),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    result = audit_service.get_logs(
        resource_type=resource_type,
        action=action,
        actor_email=actor_email,
        search=search,
        page=page,
        page_size=page_size,
    )

    return SuccessResponse(
        message="Audit logs retrieved successfully",
        data=result["data"],
        meta=result["meta"],
    )
