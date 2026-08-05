from rest_framework import permissions, status
from rest_framework.views import APIView

from accounts.serializers import RegisterSerializer
from utils.api_response import api_response
from utils.get_tokens_for_user import get_tokens_for_user


class RegisterUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = get_tokens_for_user(user)

        response = api_response(
            user=serializer.data,
            access_token=token["access"],
            message="User registered success",
            status_code=status.HTTP_201_CREATED,
        )

        response.set_cookie(
            key="refresh_token",
            value=token["refresh"],
            httponly=True,
            secure=False,
            samesite="Lax",
        )

        return response
