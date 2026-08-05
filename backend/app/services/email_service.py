import resend

from app.core.config import settings


resend.api_key = settings.resend_api_key


class EmailService:
    async def send_welcome_email(self, email: str, name: str) -> None:
        resend.Emails.send({
            "from": settings.mail_from,
            "to": [email],
            "subject": "Welcome to Farmeco 🎉",
            "html": f"""
                <h2>Welcome to Farmeco 🎉</h2>
                <p>Hi {name},</p>
                <p>Thank you for joining Farmeco — the modern marketplace for livestock &amp; poultry.</p>
                <p>We're excited to have you!</p>
            """,
        })

    async def send_password_reset_email(self, email: str, reset_link: str) -> None:
        resend.Emails.send({
            "from": settings.mail_from,
            "to": [email],
            "subject": "Reset your password",
            "html": f"""
                <h2>Password Reset</h2>
                <p>You requested to reset your password.</p>
                <a href="{reset_link}" style="display:inline-block;padding:12px 24px;background:#2f5d3f;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">
                    Reset Password
                </a>
                <p style="margin-top:16px;font-size:13px;color:#666;">
                    Or copy this link into your browser:<br>
                    <span style="font-size:12px;">{reset_link}</span>
                </p>
            """,
        })
