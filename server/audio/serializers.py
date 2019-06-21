from django.contrib.auth.models import User, Group
from rest_framework import serializers

from .models import Audio


class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = (
            'id', 'name', 'audio',
            'is_added', 'created_at', 'updated_at'
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')
