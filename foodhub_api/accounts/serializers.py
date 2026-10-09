from rest_framework import serializers
from .models import Customer, RestaurantPartner

class CustomerRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['name','phone_number','password']

    def create(self, validated_data):
        customer = Customer(name=validated_data["name"],phone_number=validated_data["phone_number"])
        customer.set_password(validated_data["password"])
        customer.save()
        return customer

class PartnerRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantPartner
        fields = ["name","email","password"]

    def create(self, validated_data):
        partner = RestaurantPartner(name=validated_data["name"],email=validated_data["email"])
        partner.set_password(validated_data["password"])
        partner.save()
        return partner