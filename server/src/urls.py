from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


urlpatterns += [
    path('admin/', admin.site.urls),
    path('', include('audio.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
