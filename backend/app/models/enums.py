from enum import StrEnum


class UserRole(StrEnum):
    BUYER = "buyer"
    SELLER = "seller"
    ADMIN = "admin"


class AuthProvider(StrEnum):
    CREDENTIALS = "credentials"
    GOOGLE = "google"


class ProductStatus(StrEnum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class ProductBadge(StrEnum):
    FEATURED = "featured"
    BEST_SELLER = "best-seller"
    NEW = "new"
    ORGANIC = "organic"
    SALE = "sale"
    CERTIFIED = "certified"
    TOP = "top"


class OrderStatus(StrEnum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class PaymentMethod(StrEnum):
    CARD = "card"
    COD = "cod"
    BANK_TRANSFER = "bank_transfer"


class PaymentStatus(StrEnum):
    UNPAID = "unpaid"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class NotificationType(StrEnum):
    MESSAGE = "message"
    ORDER = "order"
    PAYMENT = "payment"
    SYSTEM = "system"


class CouponType(StrEnum):
    PERCENT = "percent"
    FIXED = "fixed"


class ContactStatus(StrEnum):
    NEW = "new"
    READ = "read"
    REPLIED = "replied"


class TokenType(StrEnum):
    ACCESS = "access"
    REFRESH = "refresh"
    PASSWORD_RESET = "password_reset"
