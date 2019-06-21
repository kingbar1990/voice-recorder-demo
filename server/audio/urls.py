from django.urls import include, path
from rest_framework import routers

from audio import views as audios_views

router = routers.DefaultRouter()
router.register('audios', audios_views.AudioViewSet)
router.register('users', audios_views.UserViewSet)
router.register('groups', audios_views.GroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
