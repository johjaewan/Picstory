from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class MemberManager(BaseUserManager):
    """ MemberManager
    BaseUserManager 클래스를 상속받아 Member 모델의 매니저를 정의
    BaseUserManager 는 장고에서 기본으로 제공하는 user 매니저
    """             
    def create_user(self, email, password=None, **extra_fields):
        """ 일반유저 생성
        email, password 등 필드를 받아 새로운 Member 인스턴스를 생성하고, 이를 데이터베이스에 저장
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    # def create_superuser(self, email, password=None, **extra_fields):
    #     """ 슈퍼유저 생성
    #     is_staff와 is_superuser를 추가로 설정
    #     """
    #     extra_fields.setdefault('is_staff', True)
    #     extra_fields.setdefault('is_superuser', True)
    #     return self.create_user(email, password, **extra_fields)

class Member(AbstractBaseUser):                 
    """ 커스텀 사용자 모델
    AbstractBaseUser를 상속받아 기본적으로 제공해주는 사용자 모델을 재정의
    is_active와 is_staff 필드는 각각 활성화 여부와 관리자 여부
    objects는 MemberManager 인스턴스를 사용
    USERNAME_FIELD는 로그인에 사용될 필드를 지정, 여기서는 email 필드가 사용
    REQUIRED_FIELDS는 createsuperuser 명령에서 필수로 입력받아야 하는 필드를 지정
    __str__ 메서드는 객체를 문자열로 표현할 때 사용, 이 모델에서는 이메일을 문자열로 반환
    """
    email = models.EmailField(unique=True)         

    # is_active = models.BooleanField(default=True)  
    # is_staff = models.BooleanField(default=False)
    nickname = models.CharField(max_length=55,unique=True)
    objects = MemberManager()
    USERNAME_FIELD = 'email'            
    REQUIRED_FIELDS = []                    

    def __str__(self):
        return self.email