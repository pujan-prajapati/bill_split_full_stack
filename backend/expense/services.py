from decimal import Decimal

from expense.models import Expense, ExpenseParticipant


class ExpenseService:
    @staticmethod
    def build_participant_objects(expense, participants):
        participant_objects = []

        if expense.split_type == Expense.SplitType.EQUAL:
            share_amount = (expense.amount / len(participants)).quantize(
                Decimal("0.01")
            )

            total = Decimal("0.00")

            for index, participant in enumerate(participants):
                if index == len(participants) - 1:
                    amount = expense.amount - total
                else:
                    amount = share_amount
                    total += share_amount

                participant_objects.append(
                    ExpenseParticipant(
                        expense=expense,
                        user=participant["user"],
                        share_amount=amount,
                    )
                )

        elif expense.split_type == Expense.SplitType.EXACT:
            for participant in participants:
                participant_objects.append(
                    ExpenseParticipant(expense=expense, **participant)
                )

        else:
            for participant in participants:
                percentage = participant["percentage"]
                share_amount = (expense.amount * percentage) / Decimal(100)

                participant_objects.append(
                    ExpenseParticipant(
                        expense=expense,
                        user=participant["user"],
                        percentage=percentage,
                        share_amount=share_amount,
                    )
                )

        return participant_objects
