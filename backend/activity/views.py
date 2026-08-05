from rest_framework import generics

from activity.models import Activity
from activity.serializers import ActivitySerializer
from utils.pagination import CustomPagination


class ActivityListView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        return (
            Activity.objects.filter(group__group_members__user=self.request.user)
            .select_related("user", "group")
            .order_by("-created_at")
        )
