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

redis_client = redis.Redis(host='localhost', port=6379, db=0)


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        password = data.get('password')
        nickname = data.get('nickname')
        if email and password and nickname:
            if Member.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email is already registered'}, status=409)
            if Member.objects.filter(nickname=nickname).exists():
                return JsonResponse({'error': 'Nickname is already taken'}, status=409)
            member = Member(email=email, nickname=nickname)
            member.set_password(password)

            # 임의의 토큰값 생성
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

            # redis_client에 저장
            redis_client.set(email,code,ex=3600)

            # member 저장
            member.is_active = 0
            member.save()
            
            subject = "Verify your email address"
            message = f"Your verification code is: {code}"
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [member.email]
            fail_silently = False

            send_mail(subject, message, from_email, recipient_list, fail_silently)

            return JsonResponse({'message': 'Please verify your email address'},status=201)
        else:
            if not email:
                return JsonResponse({'error': 'Email field is required'}, status=400)
            elif not password:
                return JsonResponse({'error': 'Password field is required'}, status=400)
            elif not nickname:
                return JsonResponse({'error': 'Nickname field is required'}, status=400)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
    

@csrf_exempt
def send_email_verify_code(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        password = data.get('password')
        member = Member.objects.filter(email=email).first()

        if not member:
            return JsonResponse({'error': '존재하지 않는 이메일입니다.'}, status=404)
        if not check_password(password, member.password):
            return JsonResponse({'error': '비밀번호가 틀렸습니다'}, status=401)
        
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        
        if redis_client.exists(email):
            redis_client.delete(email)

        redis_client.set(email,code,ex=3600)
        subject = "Verify your email address"
        message = f"Your verification code is: {code}"
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [member.email]
        fail_silently = False
        send_mail(subject, message, from_email, recipient_list, fail_silently)

        return JsonResponse({'message': 'Please verify your email address'},status=200)

@csrf_exempt
def verify_email(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        # POST 요청에서 인증코드와 이메일을 받아옴
        email = data.get('email')
        code = data.get('code')
        if redis_client.exists(email):
            value = redis_client.get(email).decode()
            # 이메일과 인증코드를 이용하여 사용자 인증 처리
            member = Member.objects.filter(email=email).first()
            if value==code:
                member.is_active = True
                member.save()
                redis_client.delete(email)
                return JsonResponse({'message': 'email has been successfully verified' },status=200)
        return JsonResponse({'eroor': 'an incorrect or expired verification code' },status=400)
    return JsonResponse({'eroor': 'Only POST requests are allowed' },status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))

        email = data.get('email')
        password = data.get('password')
        
        member = Member.objects.filter(email=email).first()
        print(member)
        print(member.is_active)

        if member is None: # 해당 email의 user가 존재하지 않는 경우
            return JsonResponse({'error': '존재하지 않는 이메일'}, status=404)
        if not member.is_active:
            return JsonResponse({'error ':'비활성화인 계정입니다'}, status=403)
        if not check_password(password, member.password): # 비밀번호에서 틀린 경우
            return JsonResponse({'error': '비밀번호가 틀렸습니다'}, status=403)

        token = MyTokenObtainPairSerializer.get_token(member)
        refresh_token = str(token)
        access_token = str(token.access_token)
        print('access_token=',access_token)
        print('refresh_token=',refresh_token)

        response = JsonResponse({'email':member.email,'nickname':member.nickname}, status=200)
        response.set_signed_cookie('access_token', access_token, httponly=True)
        response.set_signed_cookie('refresh_token', refresh_token, httponly=True)

        # response['Refresh-Token'] = f'Bearer {str(refresh_token)}'
        # response['Authorization'] = f'Bearer {str(access_token)}'

        response['X-CSRFToken'] = get_token(request)
        return response
    return JsonResponse({'eroor': 'Only POST requests are allowed' },status=405)


@csrf_exempt
def token_refresh(request):
    """새로고침시 새로운 access_token 발송

    """
    if request.method == 'POST':
        refresh_token = request.get_signed_cookie('refresh_token', default=None)
        try:
            jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
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
    return JsonResponse({'eroor': 'Only POST requests are allowed' },status=405)   
    
# @api_view(['POST'])
# @csrf_exempt
def test(request):
    access_token = request.COOKIES.get('access_token')
    refresh_token = request.COOKIES.get('refresh_token')
    print(access_token)
    print(refresh_token)
    return JsonResponse({'message':'access_token은 header에 refresh토큰은 cookie에 담겨 전송됨'},status = 200)

