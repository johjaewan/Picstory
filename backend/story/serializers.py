from rest_framework import serializers
from .models import Story

class StorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Story
        fields = ('id', 'created_at', 'title', 'image', 'genre', 'content_en', 'content_ko', 'voice')


class StoryDetailSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True, format="%m-%d")

    class Meta:
        model = Story
        fields = ('created_at', 'title', 'image', 'genre', 'content_en', 'content_ko', 'voice')


class StoryListSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True, format="%m-%d")

    class Meta:
        model = Story
        fields = ('created_at', 'id', 'title', 'image', 'genre')