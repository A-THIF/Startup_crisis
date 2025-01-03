from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    # Field for the post's title
    title = models.CharField(max_length=200, unique=True)

    # Field for the content of the post
    content = models.TextField()

    # Field for the author; uses a ForeignKey to link to the built-in User model
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    # Field for the publication date; auto-populates with the current date and time when