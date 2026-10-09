from rest_framework import serializers
from .models import DeliveryAddress


class DeliveryAddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = DeliveryAddress

        fields = [
            "id",
            "flat_no",
            "area",
            "landmark",
            "city",
            "state",
            "pincode",
            "created_at",
        ]

        read_only_fields = ["id", "created_at"]