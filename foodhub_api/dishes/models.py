from django.db import models
from  restaurants.models import Restaurant

# Create your models here.
class Dish(models.Model):
    restaurant=models.ForeignKey(Restaurant,on_delete=models.CASCADE,related_name="dishes")
    name=models.CharField(max_length=100)
    description=models.TextField(blank=True)
    price=models.DecimalField(max_digits=10,decimal_places=2)
    category=models.CharField(max_length=100)
    image=models.ImageField(upload_to="dishes/",blank=True,null=True)
    is_available=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name