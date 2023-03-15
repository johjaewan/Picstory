from django.urls import path
from . import views

app_name = "story"
urlpatterns = [
    path('<int:story_pk>', views.get_story),
    path('create', views.create_story),
    path('delete', views.delete_story),

    # path('save', views.save_story),

    path('test', views.test),       # 테스트용
]
