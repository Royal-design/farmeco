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

    def send_message_reply_email(
        self,
        email: str,
        name: str,
        ticket: str,
        subject: str,
        reply: str,
    ) -> None:
        reply_html = reply.replace("\n", "<br>")
        resend.Emails.send({
            "from": settings.mail_from,
            "to": [email],
            "subject": f"Re: {subject}",
            "html": f"""
                <h2>We've responded to your message</h2>
                <p>Hi {name},</p>
                <p>Regarding your message <strong>{ticket}</strong> — "{subject}":</p>
                <div style="margin:16px 0;padding:16px;border-left:3px solid #2f5d3f;background:#f5f7f5;border-radius:6px;font-size:14px;line-height:1.6;">
                    {reply_html}
                </div>
                <p style="font-size:13px;color:#666;">
                    You can also view this response anytime in your Farmeco account dashboard under "Messages".
                </p>
            """,
        })
