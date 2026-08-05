from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True, null=False, blank=False)
    avatar = models.ImageField(
        upload_to="avatar/", default="/avatar/default.jpg", null=True, blank=True
    )
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    def __str__(self):
        return self.email
