from django.db import models
from accounts.models import RestaurantPartner

# Create your models here.
class Restaurant(models.Model):
    partner=models.ForeignKey(RestaurantPartner,on_delete=models.CASCADE,related_name="restaurants")
    name=models.CharField(max_length=150)
    address=models.TextField()
    city=models.CharField(max_length=100)
    state=models.CharField(max_length=100)
    pincode=models.CharField(max_length=10)
    food_types=models.JSONField(default=list)
    description=models.TextField(blank=True)
    image=models.ImageField(upload_to="restaurants/",blank=True,null=True)
    is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
