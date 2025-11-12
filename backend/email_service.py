import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
FROM_EMAIL = os.environ.get('FROM_EMAIL', SMTP_USER)
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')


def send_email(to_email: str, subject: str, body: str, html: bool = False):
    """Send email via SMTP"""
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured. Email not sent.")
        logger.info(f"Email to {to_email}: {subject}")
        logger.info(f"Body: {body}")
        return
    
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email

        if html:
            part = MIMEText(body, 'html')
        else:
            part = MIMEText(body, 'plain')
        msg.attach(part)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        
        logger.info(f"Email sent successfully to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")


def send_verification_email(to_email: str, username: str, token: str):
    """Send email verification email"""
    verification_link = f"{FRONTEND_URL}/verify-email?token={token}"
    
    subject = "Verify Your Clone X Email"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1DA1F2;">Welcome to Clone X, {username}!</h2>
          <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{verification_link}" style="background-color: #1DA1F2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">Verify Email</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #1DA1F2; word-break: break-all;">{verification_link}</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">If you didn't create this account, you can safely ignore this email.</p>
        </div>
      </body>
    </html>
    """
    
    send_email(to_email, subject, body, html=True)


def send_password_reset_email(to_email: str, username: str, token: str):
    """Send password reset email"""
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"
    
    subject = "Reset Your Clone X Password"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1DA1F2;">Password Reset Request</h2>
          <p>Hi {username},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{reset_link}" style="background-color: #1DA1F2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #1DA1F2; word-break: break-all;">{reset_link}</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      </body>
    </html>
    """
    
    send_email(to_email, subject, body, html=True)


def send_password_changed_email(to_email: str, username: str):
    """Send password changed confirmation email"""
    subject = "Your Clone X Password Was Changed"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1DA1F2;">Password Changed Successfully</h2>
          <p>Hi {username},</p>
          <p>This is a confirmation that your Clone X password was changed successfully.</p>
          <p>If you didn't make this change, please contact support immediately.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">Clone X Security Team</p>
        </div>
      </body>
    </html>
    """
    
    send_email(to_email, subject, body, html=True)
