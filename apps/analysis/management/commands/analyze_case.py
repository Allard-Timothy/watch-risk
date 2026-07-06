from django.core.management.base import BaseCommand, CommandError

from apps.analysis.service import run_analysis_for_case
from apps.cases.models import WatchCase


class Command(BaseCommand):
    help = "Run buyer-risk analysis for a watch case."

    def add_arguments(self, parser):
        parser.add_argument("case_id", type=int)

    def handle(self, *args, **options):
        case_id = options["case_id"]
        try:
            case = WatchCase.objects.get(pk=case_id)
        except WatchCase.DoesNotExist as exc:
            raise CommandError(f"WatchCase {case_id} does not exist") from exc

        report = run_analysis_for_case(case)
        self.stdout.write(self.style.SUCCESS(f"Generated report {report.pk} for case {case.pk}"))
