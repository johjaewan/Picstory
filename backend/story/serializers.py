from rest_framework import serializers
from .models import Story

class StorySerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Story
        fields = ('id', 'created_at', 'title', 'image', 'genre', 'story_en', 'story_ko', 'voice')
        # read_only_fields = ('user',)