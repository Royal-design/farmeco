from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.refresh_token import RefreshToken


class RefreshTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_refresh_token(self, refresh_token: RefreshToken) -> RefreshToken:
        self.db.add(refresh_token)
        self.db.commit()
        self.db.refresh(refresh_token)
        return refresh_token

    def get_by_jti(self, token_jti: str) -> RefreshToken | None:
        return (
            self.db.query(RefreshToken)
            .filter(RefreshToken.token_jti == token_jti)
            .first()
        )

    def revoke_by_jti(self, token_jti: str) -> None:
        refresh_token = self.get_by_jti(token_jti)
        if refresh_token:
            refresh_token.revoked = True
            self.db.commit()

    def get_active_by_user(self, user_id: UUID) -> list[RefreshToken]:
        return (
            self.db.query(RefreshToken)
            .filter(
                RefreshToken.user_id == user_id,
                RefreshToken.revoked == False,
                RefreshToken.expires_at > datetime.now(timezone.utc),
            )
            .order_by(RefreshToken.created_at.desc())
            .all()
        )
