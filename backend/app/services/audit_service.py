from app.models.audit_log import AuditLog
from app.models.user import User
from app.repositories.audit_repository import AuditLogRepository
from app.schemas.user import PaginationMeta


class AuditService:
    def __init__(self, repository: AuditLogRepository):
        self.repository = repository

    # -------------------------
    # RECORD AN ACTION
    # -------------------------
    def record(
        self,
        *,
        actor: User | None,
        action: str,
        resource_type: str,
        resource_id: str | None = None,
        summary: str,
        before: dict | None = None,
        after: dict | None = None,
        ip_address: str | None = None,
    ) -> AuditLog:
        log = AuditLog(
            actor_id=actor.id if actor else None,
            actor_email=actor.email if actor else None,
            actor_name=actor.name if actor else None,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            summary=summary,
            before_data=before,
            after_data=after,
            ip_address=ip_address,
        )
        return self.repository.create(log)

    # -------------------------
    # GET LOGS (ADMIN)
    # -------------------------
    def get_logs(
        self,
        resource_type: str | None = None,
        action: str | None = None,
        actor_email: str | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> dict:
        logs, total, total_pages = self.repository.get_logs(
            resource_type=resource_type,
            action=action,
            actor_email=actor_email,
            search=search,
            page=page,
            page_size=page_size,
        )

        return {
            "data": logs,
            "meta": PaginationMeta(
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages,
            ).model_dump(),
        }

