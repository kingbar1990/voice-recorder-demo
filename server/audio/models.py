from django.db import models
from django.utils.translation import ugettext_lazy as _


class Audio(models.Model):
    name = models.TextField(_('name'))
    audio = models.FileField(
        _('audio'), upload_to="audios", blank=True, null=True)
    is_added = models.BooleanField(_('is added'), default=False)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    def __str__(self):
        return self.name
