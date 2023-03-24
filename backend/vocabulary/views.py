from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .serializers import VocabularySerializer, VocabularyListSerializer
from .models import Vocabulary

# Create your views here.
@api_view(['POST'])
def save_word(request):
    """단어 저장

    :return str: ok 저장 완료
    TODO: 유저 구현 시 주석 확인 필요
    """

    # if not request.user.is_authenticated:
    #     return Response({"error": "권한이 없습니다."}, status=status.HTTP_401_UNAUTHORIZED)

    serializer = VocabularySerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        # serializer.save(member=request.user)
        serializer.save()
        return Response('ok', status=status.HTTP_200_OK)
    

@api_view(['GET'])
def get_vocabulary(request):
    """유저의 단어장 조회

    :return list: 유저의 단어 목록 리턴
    TODO: 유저 구현 시 주석 확인 필요
    """

    # member = request.user

    # if not member.is_authenticated:
    #     return Response({"error": "권한이 없습니다."}, status=status.HTTP_401_UNAUTHORIZED)
    
    criteria = request.GET.get('criteria')
    if criteria == '':
        # vocabulary = Vocabulary.objects.filter(member=member).order_by('created_at')
        vocabulary = Vocabulary.objects.all().order_by('created_at')
    elif criteria == 'alpha':
        # vocabulary = Vocabulary.objects.filter(member=member).order_by('word')
        vocabulary = Vocabulary.objects.all().order_by('word')

    serializers = VocabularyListSerializer(vocabulary, many=True)
    return Response(serializers.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_all_vocabulary(request):
    """로딩 화면에서 보여줄 단어 랜덤 조회

    :return list: 최대 100개의 단어 목록을 리턴한다.
    TODO: 유저 구현 시 주석 확인 필요
    """

    # member = request.user

    # if not member.is_authenticated:
    #     return Response({"error": "권한이 없습니다."}, status=status.HTTP_401_UNAUTHORIZED)
    
    vocabulary = Vocabulary.objects.all().order_by('?')[:100]
    serializers = VocabularyListSerializer(vocabulary, many=True)
    return Response(serializers.data, status=status.HTTP_200_OK)