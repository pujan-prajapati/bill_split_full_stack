from rest_framework.exceptions import PermissionDenied

from groups.models import GroupMember


class GroupPermissionService:
    @staticmethod
    def require_member(group, user):
        group_member = group.group_members.filter(user=user).first()
        if not group_member:
            raise PermissionDenied("You are not a group member")

        return group_member

    @staticmethod
    def require_owner(group, user):
        group_member = GroupPermissionService.require_member(group, user)
        if group_member.role != GroupMember.Roles.OWNER:
            raise PermissionDenied("Only group owner can perform this action")
        return group_member
