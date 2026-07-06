from django.urls import path

from . import views

app_name = "reports"

urlpatterns = [
    path("<int:pk>/", views.ReportDetailView.as_view(), name="detail"),
]
