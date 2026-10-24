
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from PIL import Image


def validate_profile_photo(photo):
    max_size = 2 * 1024 * 1024

    if photo.size > max_size:
        raise ValidationError(
            "Profile photos must be 2 MB or smaller."
        )

    try:
        photo.seek(0)

        with Image.open(photo) as image:
            if image.format not in ["JPEG", "PNG", "WEBP"]:
                raise ValidationError(
                    "Only JPG, PNG, or WebP images are allowed."
                )

            if image.width > 4000 or image.height > 4000:
                raise ValidationError(
                    "Maximum image dimensions are 4000 x 4000."
                )

    except (OSError, ValueError):
        raise ValidationError(
            "Please upload a valid image."
        )

    finally:
        photo.seek(0)


class UserProfile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    profile_photo = models.ImageField(
        upload_to="profile_photos/",
        blank=True,
        null=True,
        validators=[validate_profile_photo]
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"



