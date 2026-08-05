from rest_framework import status
from rest_framework.views import APIView

from accounts.serializers import ChangePasswordSerializer
from utils.api_response import api_response


class ChangePasswordView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"user": request.user}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(
            message="Password changed success", status_code=status.HTTP_200_OK
        )
