from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from decouple import config
from gtts import gTTS


from .models import Story
from .serializers import StorySerializer
from config import settings
import boto3
import uuid
import logging
import openai
import requests

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

        :param _type_ file: _description_
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

        :param str url: s3에 저장된 url
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


def text_to_speak(text):
    """이야기로 음성 파일 생성

    :param str text: 영어 이야기
    TODO: 저장된 파일에 VC 적용
    """
    tts_en = gTTS(text=text, lang='en')
    tts_en.save('audio/tts_eng_test.wav')


@api_view(['GET'])
def get_story(request, story_pk):
    """이야기 조회

    :param int story_pk:
    :return: story 객체
    """
    story = get_object_or_404(Story, pk=story_pk)
    story.image = S3Bucket().get_image_url(story.image)
    return Response(story, status=status.HTTP_200_OK)
    

@api_view(['POST'])
def delete_story(request):
    """이야기 삭제

    """
    pk = request.POST['story_pk']
    story = get_object_or_404(Story, pk=pk)
    S3Bucket().delete(story.image)
    story.delete()
    return Response(status=status.HTTP_200_OK)


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


# @api_view(['POST'])
# def save_story(request):
#     serializer = StorySerializer(data=request.data)
#     if serializer.is_valid(raise_exception=True):
#         serializer.save(user=request.user)
#         return Response(status=status.HTTP_200_OK)
    

@api_view(['POST'])
def test(request):
    print('test======================')
    return Response('success')