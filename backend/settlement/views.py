from django.shortcuts import get_object_or_404
from rest_framework import generics

from activity.models import Activity
from activity.services import ActivityService
from groups.models import Group
from groups.permission_service import GroupPermissionService
from settlement.models import Settlement
from settlement.serializers import SettlementSerializer


class ListCreateSettlementView(generics.ListCreateAPIView):
    serializer_class = SettlementSerializer

    def get_group(self):
        group = get_object_or_404(Group, pk=self.kwargs["group_id"])
        GroupPermissionService.require_member(group, self.request.user)
        return group

    def get_queryset(self):
        return Settlement.objects.filter(group=self.get_group())

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["group"] = self.get_group()
        return context

    def perform_create(self, serializer):
        settlement = serializer.save()
        ActivityService.log(
            group=settlement.group,
            user=self.request.user,
            action=Activity.Actions.SETTLEMENT_CREATED,
            description=(
                f"Settled Rs. {settlement.amount} "
                f"with {settlement.reciever.get_full_name()}"
            ),
        )


class SettlementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Settlement.objects.all()
    serializer_class = SettlementSerializer
