from django.db import models
from accounts.models import Customer
from dishes.models import Dish
from addresses.models import DeliveryAddress


class Order(models.Model):

    STATUS_CHOICES = [
        ("Placed", "Placed"),
        ("Confirmed", "Confirmed"),
        ("Preparing", "Preparing"),
        ("Out for Delivery", "Out for Delivery"),
        ("Delivered", "Delivered"),
        ("Cancelled", "Cancelled"),
    ]

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    address = models.ForeignKey(
        DeliveryAddress,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Placed"
    )

    delivery_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=40
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer.name}"


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    dish = models.ForeignKey(
        Dish,
        on_delete=models.CASCADE,
        related_name="order_items"
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def __str__(self):
        return f"{self.dish.name} x {self.quantity}"