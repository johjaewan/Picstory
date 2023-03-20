from django.shortcuts import get_object_or_404, get_list_or_404
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .serializers import VocabularySerializer
from .models import Vocabulary

# Create your views here.
@api_view(['POST'])
def save_word(request):

    # if not request.user.is_authenticated:
    #     return Response({"error": "권한이 없습니다."}, status=status.HTTP_401_UNAUTHORIZED)
    print(request.data)
    serializer = VocabularySerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        # serializer.save(member=request.user)
        serializer.save()
        return Response('ok', status=status.HTTP_200_OK)
    

@api_view(['GET'])
def get_vocabulary(request):

    # member = request.user

    # if not member.is_authenticated:
    #     return Response({"error": "권한이 없습니다."}, status=status.HTTP_401_UNAUTHORIZED)
    
    # vocabulary = get_list_or_404(Vocabulary, member=member)
    vocabulary = get_list_or_404(Vocabulary)
    serializers = VocabularySerializer(vocabulary, many=True)
    return Response(serializers.data, status=status.HTTP_200_OK)


def get_all_vocabulary(request):

    member = request.user

    if not member.is_authenticated:
        return Response({"error": "권한이 없습니다."}, status=status.HTTP_401_UNAUTHORIZED)
    
    vocabulary = get_list_or_404(Vocabulary, member=member)
    serializers = VocabularySerializer(vocabulary, many=True)
    return Response(serializers.data, status=status.HTTP_200_OK)