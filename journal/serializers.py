from rest_framework import serializers
from .models import WorkType, WorkLog

class WorkTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkType
        fields = '__all__'

class WorkLogSerializer(serializers.ModelSerializer):
    work_type_details = WorkTypeSerializer(source='work_type', read_only=True)

    class Meta:
        model = WorkLog
        fields = '__all__'