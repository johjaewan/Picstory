from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from accounts.models import Member
from .serializers import VocabularySerializer, VocabularyListSerializer
from .models import Vocabulary
from config import settings

import jwt

# Create your views here.
@api_view(['POST'])
def save_word(request):
    """단어 저장

    :return str: ok 저장 완료
    """
    access_token = request.headers.get('Authorization').split(' ')[1]
    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=['HS256'])
    member_id = payload.get('user_id')

    member = get_object_or_404(Member, pk=member_id)

    serializer = VocabularySerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(member=member)
        return Response('ok', status=status.HTTP_200_OK)
    

@api_view(['GET'])
def get_vocabulary(request):
    """유저의 단어장 조회

    :return list: 유저의 단어 목록 리턴
    """
    access_token = request.headers.get('Authorization').split(' ')[1]
    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=['HS256'])
    member_id = payload.get('user_id')
    
    criteria = request.GET.get('criteria')
    if criteria == '':
        vocabulary = Vocabulary.objects.filter(member_id=member_id).order_by('created_at')
    elif criteria == 'alpha':
        vocabulary = Vocabulary.objects.filter(member_id=member_id).order_by('word')

    serializers = VocabularyListSerializer(vocabulary, many=True)
    return Response(serializers.data, status=status.HTTP_200_OK)
