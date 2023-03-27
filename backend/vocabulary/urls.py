from django.urls import path
from . import views

app_name = "vocabulary"
urlpatterns = [
    path('save/', views.save_word),
    path('', views.get_vocabulary),
]
