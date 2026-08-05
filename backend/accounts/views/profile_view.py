from rest_framework import status
from rest_framework.views import APIView

from accounts.serializers import ProfileSerializer
from utils.api_response import api_response


class ProfileView(APIView):
    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return api_response(user=serializer.data, status_code=status.HTTP_200_OK)
