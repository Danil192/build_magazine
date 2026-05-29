from rest_framework import viewsets
from .models import WorkType, WorkLog
from .serializers import WorkTypeSerializer, WorkLogSerializer

class WorkTypeViewSet(viewsets.ModelViewSet):
    queryset = WorkType.objects.all()
    serializer_class = WorkTypeSerializer

class WorkLogViewSet(viewsets.ModelViewSet):
    queryset = WorkLog.objects.all()
    serializer_class = WorkLogSerializer

    def get_queryset(self):
        queryset = WorkLog.objects.all()
        # Добавляем фильтрацию по дате, если она передана в URL
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(work_date=date)
        return queryset