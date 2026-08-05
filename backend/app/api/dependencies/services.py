from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.blog_repository import BlogRepository
from app.repositories.category_repository import CategoryRepository
from app.repositories.contact_repository import ContactRepository
from app.repositories.coupon_repository import CouponRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.payment_method_repository import PaymentMethodRepository
from app.repositories.product_repository import ProductRepository
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.review_repository import ReviewRepository
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.blog_service import BlogService
from app.services.category_service import CategoryService
from app.services.cloudinary_service import CloudinaryService
from app.services.contact_service import ContactService
from app.services.coupon_service import CouponService
from app.services.email_service import EmailService
from app.services.order_service import OrderService
from app.services.payment_method_service import PaymentMethodService
from app.services.product_service import ProductService
from app.services.refresh_token_service import RefreshTokenService
from app.services.review_service import ReviewService
from app.services.upload_service import UploadService
from app.services.user_service import UserService


def get_cloudinary_service() -> CloudinaryService:
    return CloudinaryService()


def get_upload_service() -> UploadService:
    return UploadService(CloudinaryService())


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserService(UserRepository(db), CloudinaryService())


def get_email_service() -> EmailService:
    return EmailService()


def get_auth_service(
    db: Session = Depends(get_db),
    user_service: UserService = Depends(get_user_service),
    email_service: EmailService = Depends(get_email_service),
):
    refresh_token_repository = RefreshTokenRepository(db)
    refresh_token_service = RefreshTokenService(refresh_token_repository)
    return AuthService(
        user_service=user_service,
        email_service=email_service,
        refresh_token_service=refresh_token_service,
    )


def get_refresh_token_service(db: Session = Depends(get_db)) -> RefreshTokenService:
    return RefreshTokenService(RefreshTokenRepository(db))


def get_category_service(db: Session = Depends(get_db)) -> CategoryService:
    return CategoryService(CategoryRepository(db))


def get_product_service(db: Session = Depends(get_db)) -> ProductService:
    return ProductService(
        ProductRepository(db),
        get_category_service(db),
        CloudinaryService(),
    )


def get_review_service(db: Session = Depends(get_db)) -> ReviewService:
    return ReviewService(ReviewRepository(db), ProductRepository(db))


def get_coupon_service(db: Session = Depends(get_db)) -> CouponService:
    return CouponService(CouponRepository(db))


def get_order_service(db: Session = Depends(get_db)) -> OrderService:
    return OrderService(
        OrderRepository(db),
        ProductRepository(db),
        get_coupon_service(db),
    )


def get_blog_service(db: Session = Depends(get_db)) -> BlogService:
    return BlogService(BlogRepository(db))


def get_contact_service(db: Session = Depends(get_db)) -> ContactService:
    return ContactService(ContactRepository(db))


def get_payment_method_service(db: Session = Depends(get_db)) -> PaymentMethodService:
    return PaymentMethodService(PaymentMethodRepository(db))
