from rest_framework import serializers

from .models import Order, OrderItem


# ==========================================
# ORDER ITEM SERIALIZER
# ==========================================

class OrderItemSerializer(serializers.ModelSerializer):

    dish_name = serializers.CharField(
        source="dish.name",
        read_only=True
    )

    restaurant_id = serializers.IntegerField(
        source="dish.restaurant.id",
        read_only=True
    )

    restaurant_name = serializers.CharField(
        source="dish.restaurant.name",
        read_only=True
    )

    image = serializers.ImageField(
        source="dish.image",
        read_only=True
    )

    class Meta:

        model = OrderItem

        fields = [
            "id",
            "dish",
            "dish_name",
            "restaurant_id",
            "restaurant_name",
            "image",
            "quantity",
            "price",
        ]


# ==========================================
# ORDER SERIALIZER
# ==========================================

class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True
    )

    address_details = serializers.SerializerMethodField()

    class Meta:

        model = Order

        fields = [
            "id",
            "customer",
            "customer_name",
            "address",
            "address_details",
            "status",
            "delivery_fee",
            "total_amount",
            "created_at",
            "updated_at",
            "items",
        ]

    def get_address_details(self, obj):

        address = obj.address

        return {
            "id": address.id,
            "flat_no": address.flat_no,
            "area": address.area,
            "landmark": address.landmark,
            "city": address.city,
            "state": address.state,
            "pincode": address.pincode,
        }