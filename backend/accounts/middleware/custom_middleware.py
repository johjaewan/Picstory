import jwt
from django.conf import settings
from django.http import JsonResponse
from django.urls import resolve
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.excluded_url_patterns = ['accounts/signup/', 'accounts/login/','accounts/verify-email/',
                                      'accounts/api/token/','accounts/resend/code/','accounts/token/refresh/']
    def __call__(self, request):
        current_url_pattern = resolve(request.path_info).route
        print(current_url_pattern)
        if current_url_pattern in self.excluded_url_patterns:
            response = self.get_response(request)
            return response
        # 다음 middleware 또는 view 함수를 실행합니다.
        response = self.get_response(request)
        # access_token = request.get_signed_cookie('access_token', default=None)
        # access_token = request.headers.get('Authorization').split(' ')[1]
        access_token = request.get_signed_cookie('access_token', default=None)
        print(access_token)
        # payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=['HS256'])

        if not access_token:
            return JsonResponse({'error': 'access 토큰이 필요합니다.'}, status=401)
        
        try:
            payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=['HS256'])
        # access_token이 만료되었을때
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error':'access_token이 만료되었습니다.'},status=401)
        # 모든에러처리
        except jwt.exceptions.PyJWTError:
            return JsonResponse({'error': '유효하지 않은 access 토큰입니다.'}, status=401)
        
        return response
