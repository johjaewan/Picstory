"""
Django settings for config project.

Generated by 'django-admin startproject' using Django 3.2.13.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path
from decouple import config
from corsheaders.defaults import default_headers

import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG')

# TODO: EC2 서버 호스트로 지정
ALLOWED_HOSTS = ['*']

REDIS_KEY = config('REDIS_KEY')


CLIENT_ID = config('CLIENT_ID')

# Application definition

INSTALLED_APPS = [
    'story',
    'accounts',
    'vocabulary',

    # S3
    'storages',

    # CORS policy
    "corsheaders",
    'rest_framework',
    'django_filters',
    'django_extensions',

    # ...
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    # ...

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

# # AWS
# AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID')
# AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY')
# AWS_REGION = config('AWS_REGION')

# # S3 Storages
# AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME')
# AWS_S3_CUSTOM_DOMAIN = '%s.s3.%s.amazonaws.com' % (AWS_STORAGE_BUCKET_NAME,AWS_REGION)
# AWS_S3_OBJECT_PARAMETERS = {
#     'CacheControl': 'max-age=86400',
# }
# DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'path/to/store/my/files/')

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# redis 설정
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",                 # IP 주소와 포트 번호, 그리고 데이터베이스 번호를 설정
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    # 'django.middleware.csrf.CsrfViewMiddleware',
    
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # custom middleware 클래스 추가
    'accounts.middleware.custom_middleware.JWTAuthenticationMiddleware',
]

# 모든 호스트 허용
CORS_ALLOW_ALL_ORIGINS = True
# CORS_ALLOWED_ORIGINS = ["*"]
# CORS_ALLOWED_ORIGINS = [
#     'http://localhost:3000', # 특정 origin의 요청만 허용하는데, React의 로컬호스트만 요청을 허용.
#     'http://127.0.0.1:3000',
#     'https://j8D103.p.ssafy.io',
#     'http://j8D103.p.ssafy.io',
# ]

# 쿠키가 cross-site HTTP 요청에 포함될 수 있다
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS  =  [ 
    'DELETE' , 
    'GET' , 
    'OPTIONS' , 
    'PATCH' , 
    'POST' , 
    'PUT' , 
]

CORS_ALLOW_HEADERS  =  list(default_headers) + [
    'refresh-token',
]

# CORS_ALLOW_HEADERS  =  [ 
#     'accept' , 
#     'accept-encoding' , 
#     'authorization' , 
#     'refresh-Token' ,
#     'content-type' , 
#     'dnt' , 
#     'origin' , 
#     'user-agent' , 
#     'x-csrftoken' , 
#     'x-requested-with' , 
# ]


ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config('NAME'),
        'USER': config('USER'),
        'PASSWORD': config('PASSWORD'),
        'HOST': config('HOST'),
        'PORT': '3306',
        'OPTION': {
            'serverTimezone': 'UTC',
            'useUnicode': 'true',
            'characterEncoding': 'utf8',
        }
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# 기본유저모델을 account.Member로 설정
AUTH_USER_MODEL = 'accounts.Member'            


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.naver.com' # 메일 호스트 서버
EMAIL_PORT = 587
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
from datetime import timedelta
SIMPLE_JWT = {
  'ACCESS_TOKEN_LIFETIME': timedelta(seconds=600),
  'REFRESH_TOKEN_LIFETIME': timedelta(weeks=1),
  # It will work instead of the default serializer(TokenObtainPairSerializer).
  "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.MyTokenObtainPairSerializer",
  # ...
}
