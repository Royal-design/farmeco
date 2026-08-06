from math import ceil
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


class AuditLogRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, log: AuditLog) -> AuditLog:
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log

    def get_logs(
        self,
        resource_type: str | None = None,
        action: str | None = None,
        actor_email: str | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[AuditLog], int, int]:
        query = self.db.query(AuditLog)

        if resource_type:
            query = query.filter(AuditLog.resource_type == resource_type)

        if action:
            query = query.filter(AuditLog.action == action)

        if actor_email:
            query = query.filter(AuditLog.actor_email.ilike(f"%{actor_email}%"))

        if search:
            query = query.filter(
                AuditLog.summary.ilike(f"%{search}%")
                | AuditLog.actor_email.ilike(f"%{search}%")
            )

        total = query.count()

        offset = (page - 1) * page_size
        logs = (
            query
            .order_by(AuditLog.created_at.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        total_pages = ceil(total / page_size) if page_size else 0
        return logs, total, total_pages
