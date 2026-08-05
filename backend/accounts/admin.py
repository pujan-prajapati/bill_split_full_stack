from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from accounts.models import User


class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ["email", "first_name", "last_name", "is_staff", "avatar"]
    search_fields = ["email"]


admin.site.register(User, CustomUserAdmin)
