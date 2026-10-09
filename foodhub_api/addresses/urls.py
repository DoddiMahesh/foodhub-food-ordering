from django.urls import path
from .views import DeliveryAddressView

urlpatterns = [

    path(
        "customer/address/",
        DeliveryAddressView.as_view()
    ),

    path(
        "customer/address/<int:address_id>/",
        DeliveryAddressView.as_view(),
    ),
]