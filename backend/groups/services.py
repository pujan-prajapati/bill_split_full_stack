from decimal import Decimal


class BalanceService:
    @staticmethod
    def calculate_group_balance(group):
        balances = {}

        for member in group.group_members.all():
            balances.setdefault(member.user_id, Decimal("0.00"))

        for expense in group.expenses.all():
            balances.setdefault(expense.payer_id, Decimal("0.00"))

            for participant in expense.participants.all():
                balances.setdefault(participant.user_id, Decimal("0.00"))

        for settlement in group.settlements.all():
            balances.setdefault(settlement.payer_id, Decimal("0.00"))
            balances.setdefault(settlement.reciever_id, Decimal("0.00"))

        for expense in group.expenses.all():
            balances[expense.payer_id] += expense.amount

            for participant in expense.participants.all():
                balances[participant.user_id] -= participant.share_amount

        for settlement in group.settlements.all():
            balances[settlement.payer_id] += settlement.amount
            balances[settlement.reciever_id] -= settlement.amount

        return balances

    @staticmethod
    def simplify_debts(group):
        balances = BalanceService.calculate_group_balance(group)
        creditors = []
        debtors = []

        for user_id, balance in balances.items():
            if balance > 0:
                creditors.append({"user": user_id, "amount": balance})
            elif balance < 0:
                debtors.append({"user": user_id, "amount": abs(balance)})

        transactions = []

        creditor_index = 0
        debtor_index = 0

        while creditor_index < len(creditors) and debtor_index < len(debtors):
            creditor = creditors[creditor_index]
            debtor = debtors[debtor_index]

            payment = min(creditor["amount"], debtor["amount"])

            payer = group.group_members.get(user_id=debtor["user"]).user
            reciever = group.group_members.get(user_id=creditor["user"]).user

            transactions.append(
                {
                    "payer": {
                        "id": payer.id,
                        "name": payer.get_full_name(),
                    },
                    "reciever": {
                        "id": reciever.id,
                        "name": reciever.get_full_name(),
                    },
                    "amount": payment,
                }
            )

            creditor["amount"] -= payment
            debtor["amount"] -= payment

            if creditor["amount"] == Decimal("0.00"):
                creditor_index += 1
            if debtor["amount"] == Decimal("0.00"):
                debtor_index += 1

        return transactions
