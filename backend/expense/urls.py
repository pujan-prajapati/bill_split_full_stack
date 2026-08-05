from django.urls import path
from . import views


urlpatterns = [
    path("", views.ExpenceListCreateView.as_view(), name="expense-list-create"),
    path(
        "<int:expense_id>/",
        views.ExpenseRetrieveUpdateDestroyView.as_view(),
        name="expense-details",
    ),
    path(
        "category/",
        views.ExpenseCategoryListCreateView.as_view(),
        name="expense-list-create",
    ),
]
