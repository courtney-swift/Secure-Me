from django.db import models
from django.contrib.auth.models import User
from django.conf import settings



from django.db import models
from django.conf import settings


class SecurityAccount(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="security_accounts"
    )

    account_name = models.CharField(
        max_length=100
    )

    website = models.CharField(
        max_length=200,
        blank=True
    )

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

    def __str__(self):
        return self.account_name
