from rest_framework import serializers

from groups.services import BalanceService
from settlement.models import Settlement


class SettlementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settlement
        fields = ["id", "group", "payer", "reciever", "amount", "settled_at"]
        read_only_fields = ["group"]

    def validate(self, attrs):
        payer = attrs.get("payer")
        group = self.context.get("group")
        reciever = attrs.get("reciever")
        amount = attrs.get("amount")

        if payer == reciever:
            raise serializers.ValidationError(
                {"message": "Payer and reciever cannot be same user"}
            )

        if amount <= 0:
            raise serializers.ValidationError(
                {"message": "Amount must be greater than zero"}
            )

        group_users_id = {member.user_id for member in group.group_members.all()}

        if payer.id not in group_users_id:
            raise serializers.ValidationError(
                {"message": "Payer must be a member of this group"}
            )

        if reciever.id not in group_users_id:
            raise serializers.ValidationError(
                {"message": "Reciever must be a member of this group"}
            )

        balances = BalanceService.calculate_group_balance(group)
        payer_balance = balances[payer.id]
        reciever_balance = balances[reciever.id]

        if reciever_balance <= 0:
            raise serializers.ValidationError(
                {"message": "Reciever is not owed any money"}
            )

        if payer_balance >= 0:
            raise serializers.ValidationError({"message": "You don't owe any money"})

        if amount > abs(payer_balance):
            raise serializers.ValidationError(
                {"message": "Settlement amount exceeds your outstanding balance"}
            )

        if amount > reciever_balance:
            raise serializers.ValidationError(
                {"message": "Settlement amount exceeds reciever's outstanding credit"}
            )

        return attrs

    def create(self, validated_data):
        return Settlement.objects.create(
            group=self.context.get("group"), **validated_data
        )
