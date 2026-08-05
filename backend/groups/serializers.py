from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.serializers import UserSerializer

from .models import Group, GroupMember

User = get_user_model()


class GroupMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = GroupMember
        fields = ["id", "user", "role", "joined_at", "username"]

    def validate(self, attrs):
        group = self.context.get("group")
        username = attrs.get("username")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"message": "Username not found"})

        if GroupMember.objects.filter(user=user, group=group).exists():
            raise serializers.ValidationError({"message": "User already in group"})

        attrs["user"] = user
        return attrs

    def create(self, validated_data):
        group = self.context.get("group")
        user = validated_data.get("user")
        return GroupMember.objects.create(
            user=user, group=group, role=GroupMember.Roles.MEMBER
        )


class GroupSerializer(serializers.ModelSerializer):
    group_members = GroupMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = [
            "id",
            "name",
            "description",
            "image",
            "created_by",
            "created_at",
            "updated_at",
            "group_members",
        ]
        read_only_fields = ["created_by"]

    def create(self, validated_data):
        group = Group.objects.create(**validated_data)
        user = validated_data.get("created_by")
        GroupMember.objects.create(user=user, group=group, role=GroupMember.Roles.OWNER)
        return group
