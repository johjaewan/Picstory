from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

app_name = 'accounts'
urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('send/code/',views.send_email_verify_code,name='send_email_verify_code'),
    path('verify/email/', views.verify_email, name='verify_email'),
    path('login/', views.login, name='login'),
    path('check/duplicate/email/', views.check_duplicate_email, name='check_duplicate_email'),
    path('check/duplicate/nickname/', views.check_duplicate_nickname, name='check_duplicate_nickname'),


    path('token/refresh/', views.token_refresh, name='refresh_token'),


    path('kakao/login/',views.kakao_login, name='kakao_login'),
    path('kakao/callback/',views.kakao_callback, name='kakao_callback'),

    path('withdrawal/', views.withdrawal, name='withdrawal'),

    path('test/',views.test)
]