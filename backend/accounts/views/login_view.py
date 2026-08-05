from django.contrib.auth import authenticate
from rest_framework import permissions, status
from rest_framework.views import APIView

from accounts.serializers import LoginSerializer, UserSerializer
from utils.api_response import api_response
from utils.get_tokens_for_user import get_tokens_for_user


class LoginUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(request, email=email, password=password)

        if user is None:
            return api_response(
                message="Invalid Credential", status_code=status.HTTP_401_UNAUTHORIZED
            )

        token = get_tokens_for_user(user)

        response = api_response(
            message="Login successful",
            status_code=status.HTTP_200_OK,
            user=UserSerializer(user).data,
            access_token=token["access"],
        )

        response.set_cookie(
            key="refresh_token",
            value=token["refresh"],
            httponly=True,
            secure=False,
            samesite="Lax",
        )

        return response
