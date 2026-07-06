from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def stripe_webhook(request: HttpRequest) -> HttpResponse:
    # Placeholder.
    # Production implementation should verify STRIPE_WEBHOOK_SECRET,
    # handle checkout.session.completed idempotently, mark the case paid,
    # and enqueue the analysis task.
    return HttpResponse(status=200)
