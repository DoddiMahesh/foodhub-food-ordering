from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import CustomerRegisterSerializer,PartnerRegisterSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from .models import Customer,RestaurantPartner
# Create your views here.
class CustomerRegistrationView(APIView):
    def post(self,request):
        serializer = CustomerRegisterSerializer(data=request.data)
        if serializer.is_valid():
            customer = serializer.save()
            return Response({
                "message":"customer registered successfully"
            },
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class PartnerRegisterView(APIView):
    def post(self,request):
        serializer = PartnerRegisterSerializer(data=request.data)
        if serializer.is_valid():
            partner = serializer.save()
            return Response(
                {"message":"Partner registered successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class CustomerLoginView(APIView):
    def post(self,request):
        phone_number = request.data.get("phone_number")
        password = request.data.get("password")
        customer = Customer.objects.filter(phone_number=phone_number).first()
        if customer is None:
            return Response({"message":"No account found with this phone number."},
                              status=status.HTTP_401_UNAUTHORIZED
                            )
        if not customer.check_password(password):
            return Response(
                {"message":"Incorrect password. Please try again."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        request.session["customer_id"]=customer.id
        return Response(
            {"message":"Customer login successful"},
            status=status.HTTP_200_OK
        )


class PartnerLoginView(APIView):
    def post(self,request):
        email = request.data.get("email")
        password = request.data.get("password")
        partner = RestaurantPartner.objects.filter(email=email).first()
        if partner is None:
            return Response({"message":"No account found with this email "},
                              status=status.HTTP_401_UNAUTHORIZED
                            )
        if not partner.check_password(password):
            return Response(
                {"message":"Invalid password"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        request.session["partner_id"]=partner.id
        request.session.save()
        return Response(
            {"message":"Partner login successful"},
            status=status.HTTP_200_OK
        )

class CustomerProfileView(APIView):

    def get(self, request):

        customer_id = request.session.get("customer_id")

        if not customer_id:
            return Response(
                {
                    "message": "Customer is not logged in."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            customer = Customer.objects.get(id=customer_id)

        except Customer.DoesNotExist:
            return Response(
                {
                    "message": "Customer not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {
                "id": customer.id,
                "name": customer.name,
                "phone_number": customer.phone_number
            },
            status=status.HTTP_200_OK
        )

class PartnerProfileView(APIView):

    def get(self, request):

        partner_id = request.session.get("partner_id")

        if not partner_id:
            return Response(
                {
                    "message": "Partner is not logged in."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            partner = RestaurantPartner.objects.get(id=partner_id)

        except RestaurantPartner.DoesNotExist:
            return Response(
                {
                    "message": "Partner not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {
                "id": partner.id,
                "name": partner.name,
                "email": partner.email
            },
            status=status.HTTP_200_OK
        )

class CustomerLogoutView(APIView):

    def post(self, request):

        request.session.pop("customer_id", None)

        return Response(
            {"message": "Customer logged out successfully."},
            status=status.HTTP_200_OK
        )


class PartnerLogoutView(APIView):

    def post(self, request):

        request.session.pop("partner_id", None)

        return Response(
            {"message": "Partner logged out successfully."},
            status=status.HTTP_200_OK
        )