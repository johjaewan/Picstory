from django.shortcuts import get_object_or_404
from django.db.models.functions import Lower

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView

from accounts.models import Member
from .serializers import VocabularySerializer, VocabularyListSerializer
from .models import Vocabulary
from config import settings

import jwt

class VocabularyListView(ListAPIView):
    """Pagination 적용

    :param ListAPIView: ListAPIView 상속
    """
    queryset = Vocabulary.objects.all()
    serializer_class = VocabularyListSerializer
    pagination_class = PageNumberPagination

    def list(self, request):
        """유저의 단어장 조회 Pagination 적용

        :return : 유저의 단어 목록 pagination 적용된 json 객체 반환
            {
                "count": int,
                "next": String,
                "previous": String,
                "results": list
            }
        """
        access_token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=['HS256'])
        member_id = payload.get('user_id')
        
        criteria = request.GET.get('criteria')
        
        if criteria == '':
            vocabulary = Vocabulary.objects.filter(member_id=member_id).order_by(Lower('created_at'))
        elif criteria == 'alpha':
            vocabulary = Vocabulary.objects.filter(member_id=member_id).order_by(Lower('word'))
        vocabulary = self.filter_queryset(vocabulary)

        page = self.paginate_queryset(vocabulary)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(page, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
    