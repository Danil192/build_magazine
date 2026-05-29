from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkTypeViewSet, WorkLogViewSet

router = DefaultRouter()
router.register(r'work-types', WorkTypeViewSet)
router.register(r'work-logs', WorkLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]