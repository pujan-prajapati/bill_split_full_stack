from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken


# get token for user
def get_tokens_for_user(user):
    if not user.is_active:
        raise AuthenticationFailed("User is not active")

    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }
