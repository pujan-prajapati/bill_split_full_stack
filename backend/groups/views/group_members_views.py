from decimal import Decimal

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView

from activity.models import Activity
from activity.services import ActivityService
from groups.models import Group, GroupMember
from groups.permission_service import GroupPermissionService
from groups.serializers import GroupMemberSerializer
from groups.services import BalanceService
from utils.api_response import api_response

User = get_user_model()


class ListAddGroupMemberView(APIView):
    def get(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)
        GroupPermissionService.require_member(group, request.user)

        serializer = GroupMemberSerializer(group.group_members.all(), many=True)

        return api_response(
            message="All members of group fetched", group_members=serializer.data
        )

    def post(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)

        GroupPermissionService.require_member(group, user=request.user)

        serializer = GroupMemberSerializer(data=request.data, context={"group": group})
        serializer.is_valid(raise_exception=True)
        member = serializer.save()

        ActivityService.log(
            group=group,
            user=request.user,
            action=Activity.Actions.MEMBER_ADDED,
            description=f'Member Added "{member.user.get_full_name()}" to the group',
        )
        return api_response(
            message="Member added to group",
        )


class RemoveGroupMemberView(APIView):
    def delete(self, request, group_id, pk):
        group = get_object_or_404(Group, pk=group_id)

        GroupPermissionService.require_owner(group, user=request.user)

        balances = BalanceService.calculate_group_balance(group)

        member_to_delete = get_object_or_404(
            group.group_members.select_related("user"), user_id=pk
        )

        if balances.get(member_to_delete.user_id, Decimal("0.00")) != Decimal("0.00"):
            return api_response(
                message="Can't delete user until all balance are settled",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        ActivityService.log(
            group=group,
            user=request.user,
            action=Activity.Actions.MEMBER_REMOVED,
            description=f'Member "{member_to_delete.user.get_full_name()}" removed from the group',
        )

        member_to_delete.delete()

        return api_response(message="Member removed from group")


class LeaveGroupView(APIView):
    def delete(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)
        group_member = GroupPermissionService.require_member(group, user=request.user)

        if group_member.role == GroupMember.Roles.OWNER:
            return api_response(
                message="Group owner cannot leave the group",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        balances = BalanceService.calculate_group_balance(group)

        if balances.get(request.user.id, Decimal("0.00")) != Decimal("0.00"):
            return api_response(
                message="You cannot leave the group until all balances are settled",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        group_member.delete()

        return api_response(message="You left the group")
