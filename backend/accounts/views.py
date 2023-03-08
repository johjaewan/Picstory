import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Member
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from rest_framework.decorators import api_view

@csrf_exempt
def signup(request):
    """ 회원가입
    @csrf_exempt로 csrf해제
    post요청만 수락, 나머진 405에러
    json데이터에서 {email, password}를 받아 변수에 저장
    이메일과 비밀번호가 모두 제공되었는지 확인하는 간단한 유효성 검사만 수행중
    이후 set_password로 password암호화, save로 DB에 저장
    (Member 모델의 email 필드에 unique=True 옵션이 있으므로, save() 함수가 호출될 때마다 해당 필드의 값이 유일한지 검사한다)
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        nickname = data.get('nickname')
        if email and password:
            member = Member(email=email, nickname=nickname)
            member.set_password(password)
            member.save()
            return JsonResponse({'message': 'Member created successfully'})
        else:
            return JsonResponse({'error': 'Email and password fields are required'}, status=400)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
    
@csrf_exempt
def login_view(request):
    """로그인 함수
    post요청만 수락, 나머진 405에러
    json데이터에서 {email, password}를 받아 변수에 저장
    authenticate함수를 통해 해당 email, password와 일치하는 user 추출
    settings.py의 ```AUTH_USER_MODEL = 'accounts.Member'``` : Member테이블에서 authenticate작업 수행
    장고 제공 login함수를 통해 일시적으로 로그인 구현, 이후 jwt로 대채할 것 //현재 세션방식으로 로그인
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        print(email,password)
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful.'})
        else:
            return JsonResponse({'message': 'Invalid email or password.'}, status=400)
    else:
        return JsonResponse({'error':"Method not allowed."},status=405)