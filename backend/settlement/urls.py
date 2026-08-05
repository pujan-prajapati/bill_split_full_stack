from django.urls import path

from . import views

urlpatterns = [
    path("", views.ListCreateSettlementView.as_view(), name="settlement-list-create"),
    path("<int:pk>/", views.SettlementDetailView.as_view(), name="settlement-detail"),
]
