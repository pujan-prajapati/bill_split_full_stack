from django.contrib.auth import get_user_model
from django.db import models

from groups.models import Group

User = get_user_model()


class ExpenseCategory(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.title


class Expense(models.Model):
    class SplitType(models.TextChoices):
        EQUAL = "equal", "Equal"
        PERCENTAGE = (
            "percentage",
            "Percentage",
        )
        EXACT = "exact", "Exact"

    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    expense_category = models.ForeignKey(
        ExpenseCategory, on_delete=models.PROTECT, related_name="expenses"
    )
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="expenses")
    payer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="expenses_paid"
    )
    split_type = models.CharField(
        max_length=20, choices=SplitType.choices, default=SplitType.EQUAL
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title

    class Meta:
        ordering = ["-created_at"]


class ExpenseParticipant(models.Model):
    expense = models.ForeignKey(
        Expense, on_delete=models.CASCADE, related_name="participants"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="expense_participants"
    )
    share_amount = models.DecimalField(max_digits=10, decimal_places=2)
    percentage = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["expense", "user"], name="unique_expense_participant"
            )
        ]
