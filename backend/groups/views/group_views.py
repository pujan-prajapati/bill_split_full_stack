from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView

from activity.models import Activity
from activity.services import ActivityService
from groups.models import Group
from groups.permission_service import GroupPermissionService
from groups.serializers import GroupSerializer
from utils.api_response import api_response


class GroupListCreateView(APIView):
    def get(self, request):
        queryset = Group.objects.filter(group_members__user=request.user)
        serializer = GroupSerializer(instance=queryset, many=True)
        return api_response(
            message="Group fetched success",
            status_code=status.HTTP_200_OK,
            group=serializer.data,
        )

    def post(self, request):
        serializer = GroupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        group = serializer.save(created_by=request.user)

        ActivityService.log(
            group=group,
            user=request.user,
            action=Activity.Actions.GROUP_CREATED,
            description=f'Created group "{group.name}"',
        )

        return api_response(
            message="Group created success",
            status_code=status.HTTP_201_CREATED,
            group=serializer.data,
        )


class GroupDetailView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Group, pk=pk)

    def get(self, request, pk):
        group = self.get_object(pk)
        GroupPermissionService.require_member(group, request.user)
        serializer = GroupSerializer(instance=group)
        return api_response(
            message="Group fetched success",
            status_code=status.HTTP_200_OK,
            group=serializer.data,
        )

    def delete(self, request, pk):
        group = self.get_object(pk)
        GroupPermissionService.require_owner(group, request.user)

        ActivityService.log(
            group=group,
            user=request.user,
            action=Activity.Actions.GROUP_DELETED,
            description=f'Deleted group "{group.name}"',
        )
        group.delete()
        return api_response(
            message="Group deleted success", status_code=status.HTTP_200_OK
        )

    def put(self, request, pk):
        group = self.get_object(pk)
        GroupPermissionService.require_member(group, request.user)
        serializer = GroupSerializer(instance=group, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        group = serializer.save()

        ActivityService.log(
            group=group,
            user=request.user,
            action=Activity.Actions.GROUP_UPDATED,
            description=f'Updated group "{group.name}"',
        )
        return api_response(
            message="Group updated success",
            status_code=status.HTTP_200_OK,
            group=serializer.data,
        )
