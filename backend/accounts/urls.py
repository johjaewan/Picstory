from django.urls import path
from .views import (
    signup,
    verify_email ,
    login,send_email_verify_code,
    token_refresh,
    test,
    check_duplicate_email,
    check_duplicate_nickname
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

app_name = 'accounts'
urlpatterns = [
    path('signup/', signup, name='signup'),
    path('resend/code/',send_email_verify_code,name='send_email_verify_code'),
    path('verify/email/', verify_email, name='verify_email'),
    path('login/', login, name='login'),
    path('check/duplicate/email/', check_duplicate_email, name='check_duplicate_email'),
    path('check/duplicate/nickname/', check_duplicate_nickname, name='check_duplicate_nickname'),


    path('token/refresh/', token_refresh, name='refresh_token'),
    path('test/',test)
]