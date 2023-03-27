import json
from django.http import JsonResponse
from .models import Member
from django.core.mail import send_mail
from django.conf import settings
import random
import string
import redis
import jwt
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from .serializers import MyTokenObtainPairSerializer, MyTokenObtainPairView
from django.conf import settings
from django.contrib.auth.hashers import check_password
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.shortcuts import redirect
import requests


from django.shortcuts import redirect

redis_client = redis.Redis(host='54.180.148.188', port=6379, db=0,password = settings.REDIS_KEY)


def signup(request):
    """회원가입
    #TODO:
        소셜로그인 구현 이후 docs작성
    """
    if request.method == 'POST':
        # request body의 email,password,nickname,code 받기
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        password = data.get('password')
        nickname = data.get('nickname')
        code = data.get('code')
        # email,password,nickname,code이 모두 있는지 확인
        if email and password and nickname and code:
            if Member.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email is already registered'}, status=409)
            if Member.objects.filter(nickname=nickname).exists():
                return JsonResponse({'error': 'Nickname is already taken'}, status=409)

            # 레디스에 저장된 code와 일치하는지 확인
            if redis_client.exists(email):
                value = redis_client.get(email).decode()
                # 이메일 인증코드까지 유효하다면 회원저장
                if value==code:
                    member = Member(email=email, nickname=nickname)
                    member.set_password(password)
                    member.save()
                    return JsonResponse({'message':'Account has been created'},status=201)
            return JsonResponse({'error':'Invalid email or code'},status=400)

        else:
            if not email:
                return JsonResponse({'error': 'Email field is required'}, status=400)
            elif not password:
                return JsonResponse({'error': 'Password field is required'}, status=400)
            elif not nickname:
                return JsonResponse({'error': 'Nickname field is required'}, status=400)
            elif not code:
                return JsonResponse({'error': 'Code field is required'}, status=400)
    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

def check_duplicate_email(request):
    """이메일 중복검사
    :param str: email
    :return boolean: 0,1
    """
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        if Member.objects.filter(email=email).exists():
            return JsonResponse({'result': True})
        else:
            return JsonResponse({'result': False})
    return JsonResponse({'error': 'Only POST requests are allowed' },status=405)
       
def check_duplicate_nickname(request):
    """닉네임 중복검사
    :param str: nickname
    :return boolean: 0,1
    """
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        nickname = data.get('nickname')
        if Member.objects.filter(nickname=nickname).exists():
            return JsonResponse({'result': True})
        else:
            return JsonResponse({'result': False})
    return JsonResponse({'error': 'Only POST requests are allowed' },status=405)

def send_email_verify_code(request):
    """이메일 인증코드 전송
    #TODO:
        소셜로그인 구현 이후 docs작성
    """
    if request.method == 'POST':
        # request body에서 email 받기
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')

        # email-code쌍으로 레디스에 저장
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        if redis_client.exists(email):
            redis_client.delete(email)
        redis_client.set(email,code,ex=3600)

        print(code)
        # 이메일 보내기
        subject = "Verify your email address"
        message = f"Your verification code is: {code}"
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]
        fail_silently = False
        send_mail(subject, message, from_email, recipient_list, fail_silently)
        return JsonResponse({'message': 'Please verify your email address'},status=200)
    return JsonResponse({'error': 'Only POST requests are allowed' },status=405)

def verify_email(request):
    """이메일 인증 확인
    #TODO:
        소셜로그인 구현 이후 docs작성
    """
    if request.method == 'POST':
        # request body에서 email, code받기
        data = json.loads(request.body.decode('utf-8'))
        # POST 요청에서 인증코드와 이메일을 받아옴
        email = data.get('email')
        code = data.get('code')
        # 사용자가 보낸 code와 redis에 저장된 code가 일치하는지 확인
        if redis_client.exists(email):
            value = redis_client.get(email).decode()
            # 이메일과 인증코드를 이용하여 사용자 인증 처리
            if value==code:
                return JsonResponse({'result': True },status=200)
        return JsonResponse({'result': False },status=200)
    return JsonResponse({'error': 'Only POST requests are allowed' },status=405)

def login(request):
    """로그인
    #TODO:
        소셜로그인 구현 이후 docs작성
        # 쿠키가 아닌 header에 넣을 시 변경할 코드
        # response['Refresh-Token'] = f'Bearer {str(refresh_token)}'
        # response['Authorization'] = f'Bearer {str(access_token)}'
        response['X-CSRFToken'] = get_token(request)
    """
    if request.method == 'POST':
        # request body에서 email, password 추출
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        password = data.get('password')
        
        # 해당 email의 user가져오기
        member = Member.objects.filter(email=email).first()

        # user가 있는지, 비밀번호가 맞는지 확인
        if member is None:
            return JsonResponse({'error': 'Email does not exist'}, status=404)
        if not check_password(password, member.password): # 비밀번호에서 틀린 경우
            return JsonResponse({'error': 'Incorrect password'}, status=403)
        
        # 유효성검증 이후 jwt생성
        token = MyTokenObtainPairSerializer.get_token(member)
        refresh_token = str(token)
        access_token = str(token.access_token)

        # response body에 사용자 정보와 jwt 저장
        response = JsonResponse({'email':member.email,'nickname':member.nickname,'access_token':access_token,'refresh_token':refresh_token}, status=200)
        return response
    return JsonResponse({'error': 'Only POST requests are allowed' },status=405)

def token_refresh(request):
    """새로고침시 새로운 access_token 발송
    #TODO:
        소셜로그인 구현 이후 docs작성
    """
    if request.method == 'POST':

        # request headers에서 refresh_token 가져오기
        refresh_token = request.headers.get('Refresh-Token').split(' ')[1]

        # 해당 refresh_token이 유효하다면 새로운 access_token발급
        try:
            jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            response = JsonResponse({'access_token':access_token})
            return response
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error':'Your refresh token has expired. Please log in again to obtain a new one'},status=401)
        except (TokenError,jwt.exceptions.PyJWTError):
            return JsonResponse({'error':'Invalid refresh token'},status=401)
    return JsonResponse({'error': 'Only POST requests are allowed' },status=405)   
    
def kakao_login(request):
    code = request.GET.get('code')
    print(code)
    client_id = settings.CLIENT_ID
    redirect_uri = "https://j8d103.p.ssafy.io/"
    return redirect(
        f"https://kauth.kakao.com/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
    )

def kakao_callback(request):
    print(request)
    code = request.GET.get("code")
    client_id = settings.CLIENT_ID
    redirect_uri = "https://j8d103.p.ssafy.io/"

    token_request = requests.get(
        f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={client_id}&redirect_uri={redirect_uri}&code={code}"
    )
    token_json = token_request.json()
    error = token_json.get("error",None)
    if error is not None :
        return JsonResponse({"message": "INVALID_CODE"}, status = 400)
    access_token = token_json.get("access_token")
    print("token_json : ",token_json)
    print("access_token : ",access_token)
    profile_request = requests.get(
        "https://kapi.kakao.com/v2/user/me", headers={"Authorization" : f"Bearer {access_token}"},
    )
    profile_json = profile_request.json()
    print("profile_json : ",profile_json)
    kakao_account = profile_json.get("kakao_account")
    print(profile_json)
    email = kakao_account.get("email", None)
    print(email)


    # 회원가입
    return JsonResponse({'message': email },status=200)

@csrf_exempt
@api_view(['POST'])
def test(request):
    access_token = request.headers.get('Authorization').split(' ')[1]
    # refresh_token = request.headers.get('Refresh-Token').split(' ')[1]
    print(access_token)
    # print(refresh_token)
    return JsonResponse({'message':'테스트 성공'},status = 200)
