from fastapi import APIRouter

from app.api.routes.account import router as account_router
from app.api.routes.audit import router as audit_router
from app.api.routes.auth import router as auth_router
from app.api.routes.blog import router as blog_router
from app.api.routes.bulk import router as bulk_router
from app.api.routes.category import router as category_router
from app.api.routes.contact import router as contact_router
from app.api.routes.coupon import router as coupon_router
from app.api.routes.order import router as order_router
from app.api.routes.notification import router as notification_router
from app.api.routes.payment import router as payment_router
from app.api.routes.product import router as product_router
from app.api.routes.review import router as review_router
from app.api.routes.settings import router as settings_router
from app.api.routes.upload import router as upload_router
from app.api.routes.user import router as user_router

api_router = APIRouter()


def includes_api_routes(api: APIRouter):
    api.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])
    api.include_router(user_router, prefix="/api/v1/users", tags=["Users"])
    api.include_router(account_router, prefix="/api/v1/account", tags=["Account"])
    api.include_router(category_router, prefix="/api/v1/categories", tags=["Categories"])
    api.include_router(product_router, prefix="/api/v1/products", tags=["Products"])
    api.include_router(order_router, prefix="/api/v1/orders", tags=["Orders"])
    api.include_router(coupon_router, prefix="/api/v1/coupons", tags=["Coupons"])
    api.include_router(review_router, prefix="/api/v1/reviews", tags=["Reviews"])
    api.include_router(upload_router, prefix="/api/v1/uploads", tags=["Uploads"])
    api.include_router(blog_router, prefix="/api/v1/blog", tags=["Blog"])
    api.include_router(bulk_router, prefix="/api/v1/bulk", tags=["Bulk import"])
    api.include_router(contact_router, prefix="/api/v1/contact", tags=["Contact"])
    api.include_router(settings_router, prefix="/api/v1/settings", tags=["Settings"])
    api.include_router(audit_router, prefix="/api/v1/audit-logs", tags=["Audit"])
    api.include_router(notification_router, prefix="/api/v1/notifications", tags=["Notifications"])
    api.include_router(payment_router, prefix="/api/v1/payments", tags=["Payments"])


includes_api_routes(api_router)
