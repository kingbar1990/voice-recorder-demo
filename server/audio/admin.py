from django.contrib import admin

from .models import Audio


class AudioAdmin(admin.ModelAdmin):
    list_filter = ('is_added', 'created_at', 'updated_at')
    empty_value_display = '(None)'
    list_per_page = 10


admin.site.register(Audio, AudioAdmin)
