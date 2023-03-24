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

redis_client = redis.Redis(host='54.180.148.188', port=6379, db=0, password=settings.REDIS_KEY)

@csrf_exempt
def signup(request):
    """회원가입
    #TODO:
        소셜로그인 구현 이후 docs작성
    """
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        password = data.get('password')
        nickname = data.get('nickname')
        code = data.get('code')
        if email and password and nickname and code:
            if Member.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email is already registered'}, status=409)
            if Member.objects.filter(nickname=nickname).exists():
                return JsonResponse({'error': 'Nickname is already taken'}, status=409)

            if redis_client.exists(email):
                value = redis_client.get(email).decode()
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
    


@csrf_exempt
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
       
@csrf_exempt
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



@csrf_exempt
def send_email_verify_code(request):
    """이메일 인증코드 전송
    #TODO:
        소셜로그인 구현 이후 docs작성
    """
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')

        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        if redis_client.exists(email):
            redis_client.delete(email)
        redis_client.set(email,code,ex=3600)

        print(code)
        subject = "Verify your email address"
        message = f"Your verification code is: {code}"
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]
        fail_silently = False
        send_mail(subject, message, from_email, recipient_list, fail_silently)
        return JsonResponse({'message': 'Please verify your email address'},status=200)
    return JsonResponse({'error': 'Only POST requests are allowed' },status=405)

@csrf_exempt
def verify_email(request):
    """이메일 인증 확인
    #TODO:
        소셜로그인 구현 이후 docs작성
    """
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        # POST 요청에서 인증코드와 이메일을 받아옴
        email = data.get('email')
        code = data.get('code')
        if redis_client.exists(email):
            value = redis_client.get(email).decode()
            # 이메일과 인증코드를 이용하여 사용자 인증 처리
            if value==code:
                return JsonResponse({'result': True },status=200)
        return JsonResponse({'result': False },status=200)
    return JsonResponse({'error': 'Only POST requests are allowed' },status=405)

@csrf_exempt
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
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        print(email)
        password = data.get('password')
        
        member = Member.objects.filter(email=email).first()
        print(member)
        if member is None: # 해당 email의 user가 존재하지 않는 경우
            return JsonResponse({'error': '존재하지 않는 이메일'}, status=404)

        if not check_password(password, member.password): # 비밀번호에서 틀린 경우
            return JsonResponse({'error': '비밀번호가 틀렸습니다'}, status=403)
        token = MyTokenObtainPairSerializer.get_token(member)
        refresh_token = str(token)
        access_token = str(token.access_token)
        print('access_token=',access_token)
        print('refresh_token=',refresh_token)
        response = JsonResponse({'email':member.email,'nickname':member.nickname,'access_token':access_token,'refresh_token':refresh_token}, status=200)

        response['Refresh-Token'] = f'Bearer {str(refresh_token)}'
        response['Authorization'] = f'Bearer {str(access_token)}'
        return response
    return JsonResponse({'error': 'Only POST requests are allowed' },status=405)


@csrf_exempt
def token_refresh(request):
    """새로고침시 새로운 access_token 발송
    #TODO:
        소셜로그인 구현 이후 docs작성
    """
    if request.method == 'POST':
        refresh_token = request.get_signed_cookie('refresh_token', default=None)
        try:
            jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
            print(refresh_token)
            refresh = RefreshToken(refresh_token)
            print(refresh)
            access_token = str(refresh.access_token)
            response = JsonResponse({'message':'새로운 access_token 발급'})
            response.set_signed_cookie('access_token', access_token, httponly=True)
            return response
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error':'refresh이 만료되었습니다. 다시 로그인하여 주세요'},status=401)
        except (TokenError,jwt.exceptions.PyJWTError):
            return JsonResponse({'error':'refresh 토큰이 유효하지 않습니다. 다시 로그인하여 주세요'},status=401)
    return JsonResponse({'error': 'Only POST requests are allowed' },status=405)   
    
def KakaoLogin(request):
    code = request.GET.get('code')
    print(code)
    client_id = "64a685add992aeb867b51c3c5197e302"
    redirect_uri = "http://127.0.0.1:8000/api/accounts/sign-in/kakao/callback/"
    return redirect(
        f"https://kauth.kakao.com/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
    )

import requests
def kakaoCallBack(request):
    print(request)
    code = request.GET.get("code")
    client_id = "64a685add992aeb867b51c3c5197e302"
    redirect_uri = "http://127.0.0.1:8000/api/accounts/sign-in/kakao/callback/"
    # redirect_uri = "http://127.0.0.1:8000/api/accounts/sign-in/kakao/callback/"

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

    return JsonResponse({'message': email },status=200)

@csrf_exempt
@api_view(['POST'])
def test(request):
    # access_token = request.headers.get('Authorization').split(' ')[1]
    # refresh_token = request.headers.get('Refresh-Token').split(' ')[1]
    # print(access_token)
    # print(refresh_token)
    return JsonResponse({'message':'테스트 성공'},status = 200)
