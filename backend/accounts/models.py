from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
class MemberManager(BaseUserManager):
    """ 회원정보 관리 매니저
    BaseUserManager 클래스를 상속받아 Member 모델의 매니저를 정의
    BaseUserManager 는 장고에서 기본으로 제공하는 user 매니저
    TODO:
        관리자 계정 만들때 추가 코드
        def create_superuser(self, email, password=None, **extra_fields):
            extra_fields.setdefault('is_staff', True)
            extra_fields.setdefault('is_superuser', True)
            return self.create_user(email, password, **extra_fields)
    """


    def create_member(self, email, password=None, **extra_fields):
        """ 일반유저 생성
        :param String email: 이메일(로그인 id)
        :param String password: 패스워드
        :return Member member : member DB저장, 반환
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        member = self.model(email=email, **extra_fields)
        member.set_password(password)
        member.save(using=self._db)
        return member


class Member(AbstractBaseUser):
    """ 커스텀 사용자 모델
    AbstractBaseUser를 상속받아 기본적으로 제공해주는 사용자 모델을 재정의
    objects는 MemberManager 인스턴스를 사용
    USERNAME_FIELD는 로그인에 사용될 필드를 지정, 여기서는 email 필드가 사용
    :param String email: 이메일(로그인 id)
    :param String nickname: 닉네임
    :param String password: 패스워드
    """
    email = models.EmailField(unique=True)
    nickname = models.CharField(max_length=55, unique=True)
    is_active = models.BooleanField(default=True)
    objects = MemberManager()
    USERNAME_FIELD = 'email'

    def __str__(self):
        """Member 출력 메소드
        이메일로 반환
        """
        return self.email