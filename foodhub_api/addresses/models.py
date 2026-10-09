from django.db import models
from accounts.models import Customer

class DeliveryAddress(models.Model):
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="delivery_addresses"
    )

    flat_no = models.CharField(max_length=100)
    area = models.CharField(max_length=200)
    landmark = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=6)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.flat_no}, {self.area}, {self.city}"