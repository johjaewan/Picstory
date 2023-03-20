from django.db import models
from django.conf import settings

# Create your models here.
class Story(models.Model):
    # member = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="story")
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=55)
    image = models.CharField(max_length=55)
    genre = models.CharField(max_length=55)
    content_en = models.TextField(max_length=2047)
    content_ko = models.TextField(max_length=2047)
    voice = models.CharField(max_length=55)
