from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/", include("accounts.urls")),
    path("api/group/", include("groups.urls")),
    path("api/expense/", include("expense.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path("api/activity/", include("activity.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
