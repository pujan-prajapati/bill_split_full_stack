from django.contrib.auth import get_user_model
from django.db import models

from groups.models import Group

User = get_user_model()


class Settlement(models.Model):
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="settlements"
    )
    payer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="settlements_paid"
    )
    reciever = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="settlements_received"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    settled_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Settlement: {self.payer} paid {self.reciever} {self.amount} in group {self.group}"
