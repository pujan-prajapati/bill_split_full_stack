from django.contrib import admin
from expense.models import Expense, ExpenseCategory, ExpenseParticipant

admin.site.register(ExpenseCategory)
admin.site.register(Expense)
admin.site.register(ExpenseParticipant)
