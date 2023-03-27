from django.db import models
from django.conf import settings

# Create your models here.
class Vocabulary(models.Model):
    member = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="vocabulary")
    created_at = models.DateTimeField(auto_now_add=True)
    word = models.CharField(max_length=55)
    mean = models.CharField(max_length=103)
   