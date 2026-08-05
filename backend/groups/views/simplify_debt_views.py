from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

from groups.models import Group
from groups.permission_service import GroupPermissionService
from groups.services import BalanceService
from utils.api_response import api_response


class SimplifyDebtView(APIView):
    def get(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)
        GroupPermissionService.require_member(group, request.user)
        transactions = BalanceService.simplify_debts(group)
        return api_response(data=transactions)
