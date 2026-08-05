from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from utils.api_response import api_response


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                pass

        response = api_response(
            message="Logout successful", status_code=status.HTTP_200_OK
        )

        response.delete_cookie("refresh_token")

        return response
