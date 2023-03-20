from rest_framework import serializers
from .models import Vocabulary

class VocabularySerializer(serializers.ModelSerializer):

    class Meta:
        model = Vocabulary
        fields = ('id', 'created_at', 'word', 'mean',)
        # read_only_fields = ('member',)


class VocabularyListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vocabulary
        fields = ('word', 'mean',)