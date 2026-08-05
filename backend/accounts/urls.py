from django.urls import path

from .views import (
    ChangeAvatarView,
    ChangePasswordView,
    ForgotPasswordView,
    LoginUserView,
    LogoutView,
    PasswordResetView,
    ProfileView,
    RefreshTokenView,
    RegisterUserView,
    VerifyOtpView,
)

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path("login/", LoginUserView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("refresh/", RefreshTokenView.as_view(), name="refresh"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("verify-otp/", VerifyOtpView.as_view(), name="verify-otp"),
    path("change-avatar/", ChangeAvatarView.as_view(), name="change-avatar"),
    path(
        "forgot-password/",
        ForgotPasswordView.as_view(),
        name="forgot-password",
    ),
    path(
        "reset-password/",
        PasswordResetView.as_view(),
        name="reset-password",
    ),
]
