from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

from groups.models import Group
from groups.permission_service import GroupPermissionService
from groups.services import BalanceService
from utils.api_response import api_response


class GroupBalanceView(APIView):
    def get(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)
        GroupPermissionService.require_member(group, request.user)
        balances = BalanceService.calculate_group_balance(group)

        result = []

        for member in group.group_members.select_related("user"):
            result.append(
                {
                    "user": member.user.id,
                    "name": member.user.get_full_name(),
                    "balance": balances[member.user.id],
                }
            )

        return api_response(result=result)
