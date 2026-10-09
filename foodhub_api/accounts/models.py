from django.db import models
from django.contrib.auth.hashers import make_password,check_password
# Create your models here.

class Customer(models.Model):
    name = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=10,unique=True)
    password = models.CharField(max_length=128)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
    def check_password(self, raw_password):
        return check_password(raw_password,self.password)

    def __str__(self):
        return self.name

class RestaurantPartner(models.Model):
    name=models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def set_password(self, raw_password):
            self.password = make_password(raw_password)
    def check_password(self, raw_password):
        return check_password(raw_password,self.password)

    def __str__(self):
        return self.name