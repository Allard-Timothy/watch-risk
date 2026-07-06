from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView, DetailView, ListView, UpdateView

from .forms import WatchCaseForm
from .models import WatchCase


class CaseListView(LoginRequiredMixin, ListView):
    model = WatchCase
    template_name = "cases/list.html"
    context_object_name = "cases"

    def get_queryset(self):
        return WatchCase.objects.filter(user=self.request.user)


class CaseCreateView(LoginRequiredMixin, CreateView):
    model = WatchCase
    form_class = WatchCaseForm
    template_name = "cases/form.html"

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)


class CaseUpdateView(LoginRequiredMixin, UpdateView):
    model = WatchCase
    form_class = WatchCaseForm
    template_name = "cases/form.html"

    def get_queryset(self):
        return WatchCase.objects.filter(user=self.request.user)


class CaseDetailView(LoginRequiredMixin, DetailView):
    model = WatchCase
    template_name = "cases/detail.html"
    context_object_name = "case"

    def get_queryset(self):
        return WatchCase.objects.filter(user=self.request.user)
