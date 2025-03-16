from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Links to User
    full_name = models.CharField(max_length=255)                # e.g., "Aarav Sharma"
    date_of_birth = models.DateField()                          # e.g., "2005-03-16"

    def __str__(self):
        return self.full_name

class Component(models.Model):
    name = models.CharField(max_length=255)  # Box for item name, e.g., "Sword"
    description = models.TextField()         # Big box for details, e.g., "A sharp blade"
    photo = models.ImageField(upload_to='components_photos/')  # Box to upload a picture
    FUND_CHOICES = [
        ('cheap', 'Cheap'),
        ('moderate', 'Moderate'),
        ('expensive', 'Expensive')
    ]
    fund = models.CharField(max_length=10, choices=FUND_CHOICES)  # Dropdown for cost
    features = models.TextField()            # Box for extras, e.g., "Light, Strong"

    def __str__(self):
        return self.name  # Shows "Sword" instead of something confusing