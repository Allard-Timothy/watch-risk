from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import DetailView

from .models import Report


class ReportDetailView(LoginRequiredMixin, DetailView):
    model = Report
    template_name = "reports/detail.html"
    context_object_name = "report"

    def get_queryset(self):
        return Report.objects.filter(case__user=self.request.user)
