import jwt
from django.conf import settings
from django.http import JsonResponse
from django.urls import resolve
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
class JWTAuthenticationMiddleware:
    """ JWT 인증검사 로직
    # TODO:
        self.excluded_url_patterns에 인증을 처리하지 않을 url을 작성해 주시면 됩니다.
        ('accounts/'로 설정시 accounts앱 내의 모든 url을 인증 처지 해제)
        인증이 필요한 url은 request의 Cookie에 access_token과 refresh_token을 추가해주세요.

        access_token = request.headers.get('Authorization').split(' ')[1] : 
        쿠키가 아닌 request header에서 access_token로 변경할 시 대체코드
    """ 
    def __init__(self, get_response):
        self.get_response = get_response
        self.excluded_url_patterns = ['api/accounts/signup/', 'api/accounts/login/','api/accounts/verify/email/',
                                      'api/accounts/api/token/','api/accounts/send/code/','api/accounts/token/refresh/',
                                      'api/story/<int:story_pk>/',
                                      'api/story/delete/<int:story_pk>/',
                                      'api/story/translate/','api/story/voice/',
                                      'api/story/save/', 'api/story/list/',
                                      'api/story/word/','api/story/test/',
                                      'api/vocabulary/save/', 'api/vocabulary/', 'api/vocabulary/all/',
                                      'api/accounts/check/duplicate/email/','api/accounts/check/duplicate/nickname/'
                                    ]

    def __call__(self, request):
        current_url_pattern = resolve(request.path_info).route
        print(current_url_pattern)
        if current_url_pattern in self.excluded_url_patterns:
            response = self.get_response(request)
            return response
        response = self.get_response(request)
        access_token = request.headers.get('Authorization').split(' ')[1]
        print(f'access_token: {access_token}')
        if not access_token:
            return JsonResponse({'error': 'access 토큰이 필요합니다.'}, status=401)
        try:
            jwt.decode(access_token, settings.SECRET_KEY, algorithms=['HS256'])
        # access_token이 만료되었을때
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error':'access_token이 만료되었습니다.'},status=401)
        # 모든에러처리
        except jwt.exceptions.PyJWTError:
            return JsonResponse({'error': '유효하지 않은 access 토큰입니다.'}, status=401)
        return response
