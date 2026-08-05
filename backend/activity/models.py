from django.db import models

from groups.models import Group, User


class Activity(models.Model):
    class Actions(models.TextChoices):
        GROUP_CREATED = "group_created", "Group Created"
        GROUP_UPDATED = "group_updated", "Group Updated"
        GROUP_DELETED = "group_deleted", "Group Deleted"

        MEMBER_ADDED = "member_added", "Member Added"
        MEMBER_REMOVED = "member_removed", "Member Removed"
        MEMBER_LEFT = "member_left", "Member Left"

        EXPENSE_CREATED = "expense_created", "Expense Created"
        EXPENSE_UPDATED = "expense_updated", "Expense Updated"
        EXPENSE_DELETED = "expense_deleted", "Expense Deleted"

        SETTLEMENT_CREATED = "settlement_created", "Settlement Created"

    group = models.ForeignKey(
        Group, on_delete=models.SET_NULL, related_name="activities", null=True
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activities")

    action = models.CharField(max_length=255, choices=Actions.choices)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.description
