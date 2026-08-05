from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from expense.models import Expense, ExpenseCategory, ExpenseParticipant
from expense.services import ExpenseService

User = get_user_model()


class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = ["id", "title"]


class ExpenseParticipantSerializer(serializers.ModelSerializer):
    share_amount = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False
    )
    percentage = serializers.DecimalField(
        max_digits=5, decimal_places=2, required=False, allow_null=True
    )

    class Meta:
        model = ExpenseParticipant
        fields = ["user", "share_amount", "percentage"]


class ExpenseSerializer(serializers.ModelSerializer):
    participants = ExpenseParticipantSerializer(many=True)
    payer = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    payer_name = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = [
            "id",
            "title",
            "amount",
            "expense_category",
            "group",
            "payer",
            "payer_name",
            "split_type",
            "participants",
            "created_at",
            "updated_at",
        ]

    def get_payer_name(self, obj):
        return obj.payer.get_full_name()

    def validate(self, attrs):
        group = attrs.get("group")
        participants = attrs.get("participants", [])
        split_type = attrs.get("split_type")
        amount = attrs.get("amount")

        group_user_ids = {member.user_id for member in group.group_members.all()}

        for participant in participants:
            if participant["user"].id not in group_user_ids:
                raise serializers.ValidationError(
                    {
                        "message": (
                            f"{participant['user']} is not a member of this group"
                        )
                    }
                )

        if not participants:
            raise serializers.ValidationError(
                {"message": "At least one participant is required"}
            )

        if split_type == Expense.SplitType.EXACT:
            total = sum(participant["share_amount"] for participant in participants)

            if total != amount:
                raise serializers.ValidationError(
                    {"message": "Sum of share amounts must equal expense amount"}
                )

        elif split_type == Expense.SplitType.PERCENTAGE:
            total = sum(participant["percentage"] for participant in participants)

            if total != Decimal(100):
                raise serializers.ValidationError(
                    {"message": "Sum of percentage must equal 100"}
                )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        participants = validated_data.pop("participants")

        expense = Expense.objects.create(**validated_data)

        participant_objects = ExpenseService.build_participant_objects(
            expense, participants
        )
        ExpenseParticipant.objects.bulk_create(participant_objects)

        return expense

    @transaction.atomic
    def update(self, instance, validated_data):
        participants = validated_data.pop("participants", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if participants is not None:
            instance.participants.all().delete()

            participant_objects = ExpenseService.build_participant_objects(
                instance, participants
            )
            ExpenseParticipant.objects.bulk_create(participant_objects)

        return instance
