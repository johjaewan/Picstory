from django.shortcuts import get_object_or_404
from django.http import FileResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from decouple import config
from gtts import gTTS
from config import settings


from .models import Story
from .serializers import StorySerializer, StoryDetailSerializer
from config import settings
import boto3
import uuid
import openai
import time


class S3Bucket:
    """S3 Bucket 접근
    """
    def __init__(self):
        self.bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        self.location = settings.AWS_REGION


    def get_image_url(self, url):
        return f'https://{self.bucket_name}.s3.{self.location}.amazonaws.com/{url}'


    def upload(self, file):
        """file을 받아서 S3 Bucket에 업로드

        :param _type_ file: (이미지 or 음성 파일)
        :return str: s3에 저장될 url 리턴
        """
        print(type(file))
        s3_client = boto3.client(
            's3',
            aws_access_key_id = settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key = settings.AWS_SECRET_ACCESS_KEY
        )

        print('================================')
        print(file.content_type)

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

        :param str url: s-3에 저장된 url
        """
        s3_client = boto3.client(
            's3',
            aws_access_key_id = settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key = settings.AWS_SECRET_ACCESS_KEY
        )

        s3_client.delete_object(
            Bucket=self.bucket_name,
            Key=url,
        )


def text_to_story(genre, text):
    """이야기 생성

    :param str genre: 장르
    :param str text: 이미지 캡셔닝 문장
    :return str: 영어 이야기
    """
    openai.api_key = config('CHAT_GPT_API_KEY')
    prompt = f"make a {genre} story related the comment '{text}'"

    # version 설정
    model = "text-davinci-003"

    response = openai.Completion.create(
        engine=model,
        prompt=prompt,
        temperature = 1,
        max_tokens=500
    )

    generated_text = response.choices[0].text
    generated_text = generated_text.replace("\n","").replace("\\", "")
    return generated_text


@api_view(['GET'])
def get_story(request, story_pk):
    """이야기 조회

    :param int story_pk:
    :return: story 객체
    """
    story = get_object_or_404(Story, pk=story_pk)
    story.image = S3Bucket().get_image_url(story.image)
    story.voice = S3Bucket().get_image_url(story.voice)
    serializer = StoryDetailSerializer(story)
    return Response(serializer.data, status=status.HTTP_200_OK)
    

@api_view(['POST'])
def delete_story(request):
    """이야기 삭제

    """
    pk = request.POST['story_pk']
    story = get_object_or_404(Story, pk=pk)
    S3Bucket().delete(story.image)
    story.delete()
    return Response('ok', status=status.HTTP_200_OK)


@api_view(['POST'])
def create_story(request):
    """이야기 생성

    :return str: 영어 이야기
    """
    genre = request.data['genre']
    text = request.data['text']
    content = text_to_story(genre, text)
    data = {
        'content': content,
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
def save_story(request):
    """이야기 저장

    :return str: ok
    """
    # 예외처리
    # TODO: 입력값 체크
    print(request.FILES['image'], '111111111111111111111')
    print(request.FILES['voice'], '222222222222222222222')
    image_url = S3Bucket().upload(request.FILES['image'])
    voice_url = S3Bucket().upload(request.FILES['voice'])
    data = {
        'title': request.data['title'],
        'image': image_url,
        'genre': request.data['genre'],
        'content_en': request.data['content_en'],
        'content_ko': request.data['content_ko'],
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
        return Response('content가 없습니다.', status=status.HTTP_404_NOT_FOUND)

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

    generated_text = response['choices'][0]['message']['content'] # response.choices[0].text
    generated_text = generated_text.replace("\n","")

    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Execution time: {execution_time} seconds")
    print(generated_text)
    return Response({'content': generated_text}, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_voice(request):
    """이야기로 음성 파일 생성

    TODO: 저장된 파일에 VC 적용
    """
    print('create voice======================')
    content = request.data.get('content')
    genre = request.data.get('genre')
    tts_en = gTTS(text=content, lang='en')
    tts_en.save('audio/tts_eng.wav')

    url = uuid.uuid4().hex
    file_path = f'http://j8D103.p.ssafy.io/audio/{url}.wav'

    return Response({'voice': file_path}, status=status.HTTP_200_OK)


@api_view(['POST'])
def test(request):

    print('test======================')

    return Response({'test success'}, status=status.HTTP_200_OK)
