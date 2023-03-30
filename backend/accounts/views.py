import json, random, string, redis, jwt, requests
from django.http import JsonResponse
from .models import Member
from django.core.mail import send_mail
from django.conf import settings
from .serializers import MyTokenObtainPairSerializer
from django.conf import settings
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.shortcuts import redirect

redis_client = redis.Redis(host='54.180.148.188', port=6379, db=0,password = settings.REDIS_KEY)


def signup(request):
    """회원가입
    :param str email, str password, str nickname, str code,
    :return str message
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
    :param str email
    :return boolean 0,1
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
    :param str nickname
    :return boolean 0,1
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
    :param str email
    :return str message
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
    :param str email, str code
    :return str result
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
    :param str email, str password
    :return str email, str nickname, str access_token, str refresh_token
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
            return JsonResponse({'error': '해당유저가 없습니다.'}, status=404)
        if not check_password(password, member.password): # 비밀번호에서 틀린 경우
            return JsonResponse({'error': '비밀번호가 잘못되었습니다.'}, status=403)
        
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
    :param str refresh_token
    :return str access_token
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
    """새로고침시 새로운 access_token 발송
    :param 
    :return str email, str nickname, str access_token, str refresh_token
    """
    client_id = settings.CLIENT_ID
    # redirect_uri = "http://localhost:3000/kakaologin/"
    redirect_uri = "https://j8d103.p.ssafy.io/kakaologin/"
    print("redirect_uri : ",redirect_uri)
    return redirect(
        f"https://kauth.kakao.com/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
    )

def kakao_callback(request):
    """새로고침시 새로운 access_token 발송
    :param str code
    :return 카카오로그인페이지
    """
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        code = data.get("code")
        client_id = settings.CLIENT_ID
        redirect_uri = "https://j8d103.p.ssafy.io/kakaologin/"
        token_request = requests.get(
            f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={client_id}&redirect_uri={redirect_uri}&code={code}"
        )
        token_json = token_request.json()
        error = token_json.get("error",None)
        if error is not None :
            return JsonResponse({"message": "INVALID_CODE"}, status = 400)
        access_token = token_json.get("access_token")
        profile_request = requests.get(
            "https://kapi.kakao.com/v2/user/me", headers={"Authorization" : f"Bearer {access_token}"},
        )
        profile_json = profile_request.json()
        kakao_account = profile_json.get("kakao_account")
        email = kakao_account.get("email", None)
        member = Member.objects.filter(email=email).first()
        ### 회원가입
        if member is None:
            nickname = kakao_account.get("profile", None).get("nickname")
            member = Member(email=email, nickname=nickname)
            member.set_password(settings.SOCIAL_LOGIN_PASSWORD)
            member.save()
            token = MyTokenObtainPairSerializer.get_token(member)
            refresh_token = str(token)
            access_token = str(token.access_token)
            response = JsonResponse({'email':member.email,'nickname':member.nickname,'access_token':access_token,'refresh_token':refresh_token}, status=200)
            return response
        ### 로그인
        else:
            token = MyTokenObtainPairSerializer.get_token(member)
            refresh_token = str(token)
            access_token = str(token.access_token)
            response = JsonResponse({'email':member.email,'nickname':member.nickname,'access_token':access_token,'refresh_token':refresh_token}, status=200)
            return response
    return JsonResponse({'error': 'Only POST requests are allowed' },status=405)   


def test(request):
    """새로고침시 새로운 access_token 발송
    :param 
    :return str message
    """
    access_token = request.headers.get('Authorization').split(' ')[1]
    # refresh_token = request.headers.get('Refresh-Token').split(' ')[1]
    # print(refresh_token)
    # payload = request.response
    # print(payload)
    return redirect("https://www.naver.com/")
    # return JsonResponse({'message':'테스트 성공'},status = 200)


def withdrawal(request):
    """회원탈퇴
    :param 
    :return str message
    """
    if request.method == "DELETE":
        access_token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        member = Member.objects.filter(id=user_id).first()
        member.delete()
        return JsonResponse({'message': '회원 탈퇴가 완료되었습니다.'}, status=200)
    return JsonResponse({'error': 'Only DELETE requests are allowed'}, status=405)

# def profile(request):
#     if request.method == "GET":

