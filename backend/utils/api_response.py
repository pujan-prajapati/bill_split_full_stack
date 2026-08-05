from rest_framework.response import Response


def api_response(
    message="Success",
    status_code=200,
    **kwargs,
):
    return Response(
        {
            "statusCode": status_code,
            "success": status_code < 400,
            "message": message,
            **kwargs,
        },
        status=status_code,
    )
