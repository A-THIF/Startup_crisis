from django.db import models

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