from rest_framework import status
from rest_framework.views import APIView

from accounts.serializers import ChangeAvatarSerializer
from utils.api_response import api_response


class ChangeAvatarView(APIView):
    def patch(self, request):
        serializer = ChangeAvatarSerializer(
            instance=request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(
            message="Avatar changed success", status_code=status.HTTP_200_OK
        )
