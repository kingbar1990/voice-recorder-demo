import base64

from django.contrib.auth.models import User, Group
from django.core.files.base import ContentFile

from rest_framework.response import Response
from rest_framework import viewsets

from .models import Audio
from .serializers import AudioSerializer, UserSerializer, GroupSerializer


class AudioViewSet(viewsets.ModelViewSet):
    queryset = Audio.objects.all()
    serializer_class = AudioSerializer

    def create(self, request, *args, **kwargs):
        audio = Audio.objects.create()

        audio.name = 'Record_{0}'.format(audio.id)
        format, imgstr = request.data.get('file').split(';base64,')
        ext = format.split('/')[-1]
        data = ContentFile(
            base64.b64decode(imgstr), name='audio_{0}.'.format(audio.id) + ext)
        audio.audio = data
        audio.save()

        return Response(data={'id': audio.pk})

    def destroy(self, request, pk=None):
        audio = Audio.objects.filter(pk=pk).first()
        audio.delete()
        return Response(data={'id': pk})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
