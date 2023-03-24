from django.shortcuts import get_object_or_404, get_list_or_404
from django.core.files import File
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from decouple import config
from gtts import gTTS
from config import settings
from .voice_conversion import VC

from .models import Story
from .serializers import StorySerializer, StoryDetailSerializer, StoryListSerializer
import boto3
import uuid
import openai
import time
import logging
import requests
import os


class S3Bucket:
    """S3 Bucket 접근
    """

    

    def __init__(self):
        self.bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        self.location = settings.AWS_REGION

    def get_url(self, url):
        return f'https://{self.bucket_name}.s3.{self.location}.amazonaws.com/{url}'

    def get_file_path(self, url):
        return '/'.join(url.split('/')[-2:])

    def change_voice_path(self, url):
        """S3에 저장된 파일 경로 변경

        :param str url: S3 음성 파일 경로
        :return str: DB에 저장할 새로운 음성 파일명.확장자
        """
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        source_bucket = self.bucket_name
        source_key = self.get_file_path(url)

        destination_key = f'{uuid.uuid4().hex}.wav'

        s3_client.copy_object(
            Bucket=source_bucket,
            CopySource={'Bucket': source_bucket, 'Key': source_key},
            Key=destination_key
        )
        s3_client.delete_object(
            Bucket=source_bucket,
            Key=source_key,
        )
        return destination_key

    def upload(self, file):
        """file을 받아서 S3 Bucket에 업로드

        :param file: (이미지 or 음성 파일)
        :return str: s3에 저장될 url 리턴
        """
        print(type(file))
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )

        file_type = file.content_type.split('/')
        if file_type[0] == 'image':
            file_extension = 'jpg'
        elif file_type[0] == 'audio':
            file_extension = 'wav'
        else:
            # custom exception 구현해야 함
            raise TypeError
        
        url = f'{uuid.uuid4().hex}.{file_extension}'

        s3_client.upload_fileobj(
            file,
            self.bucket_name,
            url,
            ExtraArgs={
                "ContentType": f'{file_type[0]}/{file_extension}'
            }
        )
        return url

    def delete(self, url):
        """S3 Bucket에서 해당 url 파일 삭제

        :param str url: s3에 저장된 url
        """
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )

        s3_client.delete_object(
            Bucket=self.bucket_name,
            Key=url,
        )

    def upload_temp_wav(self, file):
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        
        url = f'create-story-wav/{uuid.uuid4().hex}.wav'

        s3_client.upload_fileobj(
            file,
            self.bucket_name,
            url,
            ExtraArgs={
                "ContentType": 'audio/wav'
            }
        )
        return self.get_url(url)
        


@api_view(['GET'])
def get_story(request, story_pk):
    """이야기 조회

    :param int story_pk:
    :return: story 객체
    """
    story = get_object_or_404(Story, pk=story_pk)
    story.image = S3Bucket().get_url(story.image)
    story.voice = S3Bucket().get_url(story.voice)
    serializer = StoryDetailSerializer(story)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_story(request, story_pk):
    """이야기 삭제

    """
    story = get_object_or_404(Story, pk=story_pk)
    S3Bucket().delete(story.image)
    S3Bucket().delete(story.voice)
    story.delete()
    return Response('ok', status=status.HTTP_200_OK)


@api_view(['POST'])
def create_story(request):
    """이야기 생성

    :return str: 영어 이야기
    """
    genre = request.data.get('genre', False)
    if not genre:
        logging.error('genre가 없습니다.')
        return Response({'error': 'genre가 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
    text = request.data.get('text', False)
    if not text:
        logging.error('text가 없습니다.')
        return Response({'error': 'text가 없습니다.'}, status=status.HTTP_404_NOT_FOUND)

    openai.api_key = config('CHAT_GPT_API_KEY')
    prompt = f"make a {genre} story related the comment '{text}'"

    # version 설정
    model = "text-davinci-003"

    response = openai.Completion.create(
        engine=model,
        prompt=prompt,
        temperature=1,
        max_tokens=500
    )

    content = response.choices[0].text
    content = content.replace("\n", "").replace("\\", "")

    return Response({'content': content}, status=status.HTTP_200_OK)


@api_view(['POST'])
def save_story(request):
    """이야기 저장

    :return str: ok
    TODO: user 구현 시 적용
    """
    image_file = request.FILES.get('image', False)
    if not image_file:
        logging.error('image 파일이 없습니다.')
        return Response({'error': 'image 파일이 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
    voice_path = request.POST.get('voice', False)
    if not voice_path:
        logging.error('voice 경로가 없습니다.')
        return Response({'error': 'voice 경로가 없습니다.'}, status=status.HTTP_404_NOT_FOUND)

    image_url = S3Bucket().upload(image_file)
    voice_url = S3Bucket().change_voice_path(voice_path)
    data = {
        'title': request.POST['title'],
        'image': image_url,
        'genre': request.POST['genre'],
        'content_en': request.POST['content_en'],
        'content_ko': request.POST['content_ko'],
        'voice': voice_url,
    }

    serializer = StorySerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        # serializer.save(user=request.user)
        serializer.save()
        return Response('ok', status=status.HTTP_200_OK)


@api_view(['POST'])
def translate_story(request):
    """이야기 번역

    :return str: 한글로 번역한 글
    """
    print('translate================================')
    start_time = time.time()
    content = request.data.get('content', False)
    if not content:
        logging.error('content가 없습니다.')
        return Response({'error': 'content가 없습니다.'}, status=status.HTTP_404_NOT_FOUND)

    openai.api_key = config('CHAT_GPT_API_KEY')
    start_time = time.time()
    model = "gpt-3.5-turbo"
    response = openai.ChatCompletion.create(
        model=model,
        messages=[
            {"role": "system", "content": "너는 번역가야"},
            {"role": "user", "content": f"다음 글을 한글로 번역해줘 {content}"}
        ]
    )

    generated_text = response['choices'][0]['message']['content']
    generated_text = generated_text.replace("\n", "").replace("\\", "")

    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Execution time: {execution_time} seconds")
    print(generated_text)
    return Response({'content': generated_text}, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_voice(request):
    """이야기로 음성 파일 생성

    TODO: 저장된 파일에 VC 적용
    TODO: S3 저장된 음성 파일 특정 시간에 제거
    """
    print('create voice======================')
    content = request.data.get('content', False)
    if not content:
        logging.info('content가 없습니다.')
        print('not content')
        return Response({'error': 'content 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
    genre = request.data.get('genre', False)
    if not genre:
        logging.info('genre가 없습니다.')
        print('not genre')
        return Response({'error': 'genre가 없습니다.'}, status=status.HTTP_404_NOT_FOUND)

    url = uuid.uuid4().hex
    tts_en = gTTS(text=content, lang='en')
    tts_en.save(f'media/audio/{url}.wav')
    logging.info('음성 저장 완료')

    # url 파일 Voice Conversion 적용
    VC(url, genre)

    # VC 적용된 url 파일
    f = open(f'media/audio/{url}.wav', 'rb')
    file = File(f)

    s3_file_url = S3Bucket().upload_temp_wav(file)

    return Response({'voice': s3_file_url}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_library(request, user_pk):
    """유저의 서재 출력

    :param int user_pk: user id
    :return list: 유저의 story 목록 리턴
    
    :TODO: user 구현 후 db 컬럼명 확인
    """
    # library = get_list_or_404(Story, member=member? member_pk)
    library = get_list_or_404(Story)
    for i in range(len(library)):
        library[i].image = S3Bucket().get_url(library[i].image)
    serializers = StoryListSerializer(library, many=True)
    return Response(serializers.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def search_word(request):
    """단어 검색

    :raise:
    :return str: 단어 뜻 리턴
    """
    content = request.data.get('content', False)
    if not content:
        logging.error('content가 없습니다.')
        return Response({'error': 'content 없습니다.'}, status=status.HTTP_404_NOT_FOUND)

    client_id = config('PAPAGO_CLIENT_ID')
    client_secret = config('PAPAGO_CLIENT_SECRET')
    url = config('PAPAGO_URL')

    # 요청 헤더
    req_header = {"X-Naver-Client-Id": client_id,
                "X-Naver-Client-Secret": client_secret}
    # 요청 파라미터
    req_param = {"source": "en", "target": "ko", "text": content}

    res = requests.post(url, headers=req_header, data=req_param)

    if res.ok:
        trans_txt = res.json()['message']['result']['translatedText']
        print(trans_txt)
        return Response({'content': trans_txt}, status=status.HTTP_200_OK)
    else:
        return Response({'error': '번역 실패'}, status=res.status_code)
