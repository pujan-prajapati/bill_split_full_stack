from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from accounts.serializers import SendPasswordRestEmailSerializer
from utils.api_response import api_response


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendPasswordRestEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(
            message="Password reset link send. Please check your Email",
            status_code=status.HTTP_200_OK,
        )
