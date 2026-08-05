from rest_framework import serializers

from activity.models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)
    group_name = serializers.CharField(source="group.name", read_only=True)

    class Meta:
        model = Activity
        fields = [
            "id",
            "user_name",
            "group_name",
            "action",
            "description",
            "created_at",
        ]
