from rest_framework.views import APIView

from dashboard.services import DashboardService
from utils.api_response import api_response


class DashboardView(APIView):
    def get(self, request):
        data = DashboardService.get_dashboard(request.user)
        return api_response(message="Dashboard fetched success", data=data)
