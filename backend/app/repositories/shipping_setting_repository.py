from sqlalchemy.orm import Session

from app.models.shipping_setting import ShippingSetting


class ShippingSettingRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self) -> ShippingSetting | None:
        return self.db.query(ShippingSetting).first()

    def create(
        self,
        free_shipping_threshold: float,
        flat_rate: float,
    ) -> ShippingSetting:
        setting = ShippingSetting(
            free_shipping_threshold=free_shipping_threshold,
            flat_rate=flat_rate,
        )
        self.db.add(setting)
        self.db.commit()
        self.db.refresh(setting)
        return setting

    def update(self, setting: ShippingSetting) -> ShippingSetting:
        self.db.commit()
        self.db.refresh(setting)
        return setting
