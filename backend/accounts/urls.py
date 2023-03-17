from django.urls import path
from .views import (
    signup,
    verify_email ,
    login,send_email_verify_code,
    token_refresh,
    test
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


    path('token/refresh/', token_refresh, name='refresh_token'),
    # # access 토큰과 refresh토큰을 발급
    # path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'), 

    # # refresh토큰을 받았을 때 새로운 access토큰과 refresh토큰을 발급
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  

    path('test/',test)
]