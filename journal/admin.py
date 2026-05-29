from django.contrib import admin
from .models import WorkType, WorkLog

@admin.register(WorkType)
class WorkTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'unit')
    search_fields = ('name',)

@admin.register(WorkLog)
class WorkLogAdmin(admin.ModelAdmin):
    list_display = ('work_date', 'work_type', 'volume', 'executor')
    list_filter = ('work_date', 'work_type')
    search_fields = ('executor',)