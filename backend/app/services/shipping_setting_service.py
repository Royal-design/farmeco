from app.models.shipping_setting import ShippingSetting
from app.models.user import User
from app.repositories.shipping_setting_repository import ShippingSettingRepository
from app.services.audit_service import AuditService

DEFAULT_FREE_SHIPPING_THRESHOLD = 200000
DEFAULT_FLAT_RATE = 15000


class ShippingSettingService:
    def __init__(
        self,
        repository: ShippingSettingRepository,
        audit_service: AuditService | None = None,
    ):
        self.repository = repository
        self.audit_service = audit_service

    # -------------------------
    # GET SETTINGS
    # -------------------------
    def get(self) -> ShippingSetting:
        setting = self.repository.get()

        if setting:
            return setting

        return self.repository.create(
            free_shipping_threshold=DEFAULT_FREE_SHIPPING_THRESHOLD,
            flat_rate=DEFAULT_FLAT_RATE,
        )

    # -------------------------
    # UPDATE SETTINGS (ADMIN)
    # -------------------------
    def update(
        self,
        actor: User,
        free_shipping_threshold: float,
        flat_rate: float,
    ) -> ShippingSetting:
        setting = self.get()

        previous = {
            "free_shipping_threshold": float(setting.free_shipping_threshold),
            "flat_rate": float(setting.flat_rate),
        }

        setting.free_shipping_threshold = free_shipping_threshold
        setting.flat_rate = flat_rate

        updated = self.repository.update(setting)

        if self.audit_service:
            self.audit_service.record(
                actor=actor,
                action="UPDATE",
                resource_type="shipping_settings",
                resource_id=updated.id,
                summary=(
                    f"Updated delivery fees: free over ₦{float(free_shipping_threshold):,.0f}, "
                    f"flat rate ₦{float(flat_rate):,.0f}"
                ),
                before=previous,
                after={
                    "free_shipping_threshold": float(free_shipping_threshold),
                    "flat_rate": float(flat_rate),
                },
            )

        return updated
