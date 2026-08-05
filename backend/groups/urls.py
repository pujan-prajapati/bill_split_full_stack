from django.urls import include, path

from .views import (
    GroupBalanceView,
    GroupDetailView,
    GroupListCreateView,
    LeaveGroupView,
    ListAddGroupMemberView,
    RemoveGroupMemberView,
    SimplifyDebtView,
)

urlpatterns = [
    # groups
    path("", GroupListCreateView.as_view(), name="list-create-group"),
    path("<int:pk>/", GroupDetailView.as_view(), name="group-detail"),
    # group members
    path(
        "<int:group_id>/members/",
        ListAddGroupMemberView.as_view(),
        name="list-add-group-member",
    ),
    path(
        "<int:group_id>/members/<int:pk>/",
        RemoveGroupMemberView.as_view(),
        name="remove-group-member",
    ),
    path(
        "<int:group_id>/leave/",
        LeaveGroupView.as_view(),
        name="leave-group",
    ),
    path(
        "<int:group_id>/balance/",
        GroupBalanceView.as_view(),
        name="group-balance",
    ),
    path("<int:group_id>/simplify/", SimplifyDebtView.as_view(), name="simplify-debts"),
    # settlement
    path("<int:group_id>/settlement/", include("settlement.urls")),
]
