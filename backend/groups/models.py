from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Group(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, null=True, blank=True)
    image = models.ImageField(upload_to="group-image/", null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="group")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class GroupMember(models.Model):
    class Roles(models.TextChoices):
        OWNER = (
            "owner",
            "Owner",
        )
        MEMBER = "member", "Member"

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="group_member"
    )
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="group_members"
    )
    role = models.CharField(choices=Roles.choices, default=Roles.MEMBER)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "group"], name="unique_group_member"
            ),
        ]

    def __str__(self) -> str:
        return f"{self.user.email} - {self.group.name} - {self.role}"
