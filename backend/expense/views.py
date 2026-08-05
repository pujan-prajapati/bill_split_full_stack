import django_filters.rest_framework
from rest_framework import generics

from activity.models import Activity
from activity.services import ActivityService
from expense.filters import ExpenseFilter
from expense.models import Expense, ExpenseCategory
from expense.serializers import ExpenseCategorySerializer, ExpenseSerializer
from utils.pagination import CustomPagination


class ExpenseCategoryListCreateView(generics.ListCreateAPIView):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer


class ExpenceListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filterset_class = ExpenseFilter
    pagination_class = CustomPagination

    def get_queryset(self):
        group_id = self.request.query_params.get("group_id")

        expenses = Expense.objects.filter(group__group_members__user=self.request.user)

        if group_id:
            expenses = expenses.filter(group_id=group_id)
        return expenses.select_related(
            "group", "payer", "expense_category"
        ).prefetch_related("participants", "participants__user")

    def perform_create(self, serializer):
        expense = serializer.save()
        ActivityService.log(
            group=expense.group,
            user=self.request.user,
            action=Activity.Actions.EXPENSE_CREATED,
            description=f'Added expense "{expense.title}"',
        )


class ExpenseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    lookup_url_kwarg = "expense_id"

    def get_queryset(self):
        queryset = Expense.objects.filter(group__group_members__user=self.request.user)
        return queryset

    def perform_update(self, serializer):
        expense = serializer.save()
        ActivityService.log(
            group=expense.group,
            user=self.request.user,
            action=Activity.Actions.EXPENSE_UPDATED,
            description=f'Updated expense "{expense.title}"',
        )

    def perform_destroy(self, instance):
        ActivityService.log(
            group=instance.group,
            user=self.request.user,
            action=Activity.Actions.EXPENSE_DELETED,
            description=f'Deleted expense "{instance.title}"',
        )
        instance.delete()
