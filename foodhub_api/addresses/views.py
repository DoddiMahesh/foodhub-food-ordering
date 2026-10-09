from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DeliveryAddress
from accounts.models import Customer
from .serializers import DeliveryAddressSerializer

class DeliveryAddressView(APIView):

    def get_customer(self, request):

        customer_id = request.session.get("customer_id")

        if not customer_id:
            return None

        try:
            return Customer.objects.get(id=customer_id)
        except Customer.DoesNotExist:
            return None

    # GET - Get customer's saved addresses
    def get(self, request):

        customer = self.get_customer(request)

        if not customer:
            return Response(
                {"error": "Please login first"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        addresses = DeliveryAddress.objects.filter(
            customer=customer
        ).order_by("-created_at")

        serializer = DeliveryAddressSerializer(
            addresses,
            many=True
        )

        return Response(serializer.data)

    # POST - Add new address
    def post(self, request):

        customer = self.get_customer(request)

        if not customer:
            return Response(
                {"error": "Please login first"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = DeliveryAddressSerializer(
            data=request.data
        )

        if serializer.is_valid():

            address = serializer.save(
                customer=customer
            )

            return Response(
                DeliveryAddressSerializer(address).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # PATCH - Update address
    def patch(self, request, address_id):

        customer = self.get_customer(request)

        if not customer:
            return Response(
                {"error": "Please login first"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            address = DeliveryAddress.objects.get(
                id=address_id,
                customer=customer
            )
        except DeliveryAddress.DoesNotExist:
            return Response(
                {"error": "Address not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = DeliveryAddressSerializer(
            address,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )