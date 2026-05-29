from django.db import models

class WorkType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    unit = models.CharField(max_length=50)

    class Meta:
        db_table = 'work_types'

    def __str__(self):
        return self.name

class WorkLog(models.Model):
    work_date = models.DateField()
    work_type = models.ForeignKey(WorkType, on_delete=models.RESTRICT)
    volume = models.DecimalField(max_digits=12, decimal_places=2)
    executor = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'work_logs'
        ordering = ['-work_date']