from rest_framework import serializers
from .models import Dish

class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model=Dish
        fields=["id","restaurant","name","description","price","category","image","is_available","created_at"]
        read_only_fields=["id","restaurant","created_at"]