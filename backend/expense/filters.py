from django_filters import rest_framework as filters

from expense.models import Expense


class ExpenseFilter(filters.FilterSet):
    title = filters.CharFilter(field_name="title", lookup_expr="icontains")

    class Meta:
        model = Expense
        fields = ["title"]
