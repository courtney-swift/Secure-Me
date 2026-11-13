from django.db import models
from django.conf import settings


# ============================================
# SECUREME SECURITY ACCOUNT MODEL
# ============================================

class SecurityAccount(models.Model):

    # ========================================
    # ACCOUNT OWNER
    # ========================================

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="security_accounts"
    )

    # ========================================
    # ACCOUNT INFORMATION
    # ========================================

    account_name = models.CharField(
        max_length=100
    )

    website = models.CharField(
        max_length=200,
        blank=True
    )

    # ========================================
    # SECURITY SETTINGS
    # ========================================

    mfa_enabled = models.BooleanField(
        default=False
    )

    password_unique = models.BooleanField(
        default=False
    )

    password_strength = models.CharField(
        max_length=20,
        choices=[
            ("Weak", "Weak"),
            ("Medium", "Medium"),
            ("Strong", "Strong"),
        ],
        default="Weak"
    )

    recovery_updated = models.BooleanField(
        default=False
    )

    # ========================================
    # PHASE 6 - LESSON 5
    # PASSWORD CHANGE TRACKING
    # ========================================

    # This date is reported by the user.
    # SecureMe does not store external passwords
    # or independently verify password changes.

    last_password_change = models.DateField(
        null=True,
        blank=True,
        help_text=(
            "Enter the date you last changed this "
            "account's password. SecureMe does not "
            "verify changes on external websites."
        )
    )

    # ========================================
    # CALCULATE ACCOUNT SECURITY SCORE
    # ========================================

    def calculate_security_score(self):

        score = 0

        # MULTI-FACTOR AUTHENTICATION
        if self.mfa_enabled:
            score += 35

        # PASSWORD STRENGTH
        if self.password_strength == "Strong":
            score += 30

        elif self.password_strength == "Medium":
            score += 15

        # UNIQUE PASSWORD
        if self.password_unique:
            score += 20

        # RECOVERY INFORMATION
        if self.recovery_updated:
            score += 15

        return score

    # ========================================
    # DETERMINE SECURITY LEVEL
    # ========================================

    def get_security_level(self):

        score = self.calculate_security_score()

        if score >= 80:
            return "Good"

        elif score >= 50:
            return "Moderate"

        else:
            return "Needs Improvement"

    # ========================================
    # DISPLAY ACCOUNT NAME
    # ========================================

    def __str__(self):
        return self.account_name
