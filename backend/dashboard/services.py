from decimal import Decimal

from django.db.models import Sum

from expense.models import Expense
from groups.models import Group
from groups.services import BalanceService


class DashboardService:
    @staticmethod
    def get_dashboard(user):
        groups = Group.objects.filter(group_members__user=user)

        total_groups = groups.count()

        total_expenses = Expense.objects.filter(group__group_members__user=user).count()

        total_spent = Expense.objects.filter(payer=user).aggregate(total=Sum("amount"))[
            "total"
        ] or Decimal("0.00")

        category_expenses = (
            Expense.objects.filter(group__group_members__user=user)
            .values("expense_category__title")
            .annotate(total=Sum("amount"))
        )

        total_paid = Decimal("0.00")
        total_debt = Decimal("0.00")

        for group in groups:
            balance = BalanceService.calculate_group_balance(group).get(
                user.id, Decimal("0.00")
            )
            if balance > 0:
                total_paid += balance
            elif balance < 0:
                total_debt += abs(balance)

        return {
            "total_groups": total_groups,
            "total_expenses": total_expenses,
            "total_spent": total_spent,
            "total_paid": total_paid,
            "total_debt": total_debt,
            "category_expenses": category_expenses,
        }
