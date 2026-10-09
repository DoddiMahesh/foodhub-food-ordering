from rest_framework import serializers
from .models import Restaurant

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model=Restaurant
        fields=["id","name","address","city","state","pincode","food_types","description","image","is_active","created_at"]
        extra_kwargs={"image":{
            "required":False,
            "allow_null":True
        }}
        read_only_fields=["id","created_at","is_active"]

