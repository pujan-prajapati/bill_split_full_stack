from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from utils.api_response import api_response


class RefreshTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return api_response(
                message="Refresh token not found",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = TokenRefreshSerializer(data={"refresh": refresh_token})

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        access_token = validated_data["access"]
        new_refresh_token = validated_data["refresh"]

        response = api_response(
            access_token=access_token,
            message="Refresh success",
            status_code=status.HTTP_200_OK,
        )

        if new_refresh_token:
            response.set_cookie(
                key="refresh_token",
                value=new_refresh_token,
                httponly=True,
                secure=False,
                samesite="Lax",
            )

        return response
