from django.urls import path

from .views import (
    csrf_token_view,
    CreateOrderView,
    CustomerOrdersView,
    PartnerOrdersView,
)


urlpatterns = [
    path("csrf/", csrf_token_view, name="csrf-token"),
    path("create/", CreateOrderView.as_view(), name="create-order"),
    path("customer/orders/", CustomerOrdersView.as_view(), name="customer-orders"),
    path("partner/orders/", PartnerOrdersView.as_view(), name="partner-orders"),
]