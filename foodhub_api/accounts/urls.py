from django.urls import path
from .views import CustomerRegistrationView,PartnerRegisterView,CustomerLoginView,PartnerLoginView, CustomerProfileView, PartnerProfileView,CustomerLogoutView,PartnerLogoutView

urlpatterns = [
    path("customer/register/", CustomerRegistrationView.as_view()),
    path("partner/register/", PartnerRegisterView.as_view()),
    path("customer/login/", CustomerLoginView.as_view()),
    path("partner/login/", PartnerLoginView.as_view()),
    path("customer/profile/", CustomerProfileView.as_view()),
    path("partner/profile/", PartnerProfileView.as_view()),
    path("customer/logout/", CustomerLogoutView.as_view()),
    path("partner/logout/", PartnerLogoutView.as_view()),
]