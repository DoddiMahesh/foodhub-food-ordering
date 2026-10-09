from decimal import Decimal
from django.db import transaction
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.models import Customer, RestaurantPartner
from dishes.models import Dish
from addresses.models import DeliveryAddress
from restaurants.models import Restaurant
from .models import Order, OrderItem
from .serializers import OrderSerializer


# CSRF TOKEN
@ensure_csrf_cookie
def csrf_token_view(request):

    return Response({
        "message": "CSRF cookie set"
    })

# CREATE ORDER
class CreateOrderView(APIView):
    def post(self, request):

        # CHECK CUSTOMER SESSION
        customer_id = request.session.get("customer_id")
        if not customer_id:
            return Response(
                {
                    "error": "Customer is not logged in."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # GET CUSTOMER
        try:
            customer = Customer.objects.get(
                id=customer_id
            )
        except Customer.DoesNotExist:
            return Response(
                {
                    "error": "Customer not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )


        # GET REQUEST DATA
        data = request.data
        address_id = data.get(
            "address_id"
        )
        items = data.get(
            "items"
        )


        # VALIDATE ADDRESS
        if not address_id:
            return Response(
                {
                    "error": "Address ID is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # VALIDATE CART
        if not items:
            return Response(
                {
                    "error": "Cart is empty."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # VALIDATE ITEMS FORMAT
        if not isinstance(items, list):
            return Response(
                {
                    "error": "Items must be a list."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # GET CUSTOMER ADDRESS
        try:
            address = DeliveryAddress.objects.get(
                id=address_id,
                customer=customer
            )

        except DeliveryAddress.DoesNotExist:
            return Response(
                {
                    "error": "Delivery address not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        delivery_fee = Decimal("40.00")
        try:

            # DATABASE TRANSACTION
            with transaction.atomic():
            
                # CREATE ORDER
                order = Order.objects.create(
                    customer=customer,
                    address=address,
                    delivery_fee=delivery_fee,
                    total_amount=Decimal("0.00"),
                    status="Placed"
                )

                subtotal = Decimal("0.00")

                # CREATE ORDER ITEMS
                for item in items:
                    dish_id = item.get(
                        "dish_id"
                    )
                    quantity = item.get(
                        "quantity",
                        1
                    )

                    # VALIDATE DISH ID
                    if not dish_id:
                        raise ValueError(
                            "Dish ID is required."
                        )

                    # VALIDATE QUANTITY
                    try:
                        quantity = int(
                            quantity
                        )
                    except (TypeError, ValueError):
                        raise ValueError(
                            "Invalid quantity."
                        )
                    if quantity <= 0:

                        raise ValueError(
                            "Quantity must be greater than 0."
                        )

                    # GET DISH
                    try:

                        dish = Dish.objects.select_related(
                            "restaurant"
                        ).get(
                            id=dish_id
                        )

                    except Dish.DoesNotExist:
                        raise ValueError(
                            f"Dish with ID {dish_id} does not exist."
                        )

                    # CHECK AVAILABILITY
                    if not dish.is_available:
                        raise ValueError(
                            f"{dish.name} is currently unavailable."
                        )

                    # GET PRICE FROM DATABASE
                    price = Decimal(
                        str(dish.price)
                    )

                    # ITEM TOTAL
                    item_total = (
                        price * quantity
                    )
                    subtotal += item_total

                    # CREATE ORDER ITEM
                    OrderItem.objects.create(
                        order=order,
                        dish=dish,
                        quantity=quantity,
                        price=price
                    )


                # GRAND TOTAL
                grand_total = (
                    subtotal + delivery_fee
                )

                # UPDATE ORDER
                order.total_amount = grand_total
                order.save()

            # SUCCESS
            return Response(
                {
                    "message": "Order placed successfully.",
                    "order_id": order.id,
                    "subtotal": float(
                        subtotal
                    ),
                    "delivery_fee": float(
                        delivery_fee
                    ),
                    "total_amount": float(
                        grand_total
                    ),
                    "status": order.status
                },
                status=status.HTTP_201_CREATED
            )

        except ValueError as error:
            return Response(
                {
                    "error": str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as error:
            print(
                "ORDER ERROR:",
                error
            )

            return Response(
                {
                    "error": "Something went wrong while placing the order.",
                    "details": str(error)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# CUSTOMER ORDERS
class CustomerOrdersView(APIView):
    def get(self, request):
        # CHECK CUSTOMER SESSION
        customer_id = request.session.get(
            "customer_id"
        )
        if not customer_id:
            return Response(
                {
                    "error": "Customer is not logged in."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # CHECK CUSTOMER
        try:
            customer = Customer.objects.get(
                id=customer_id
            )
        except Customer.DoesNotExist:
            return Response(
                {
                    "error": "Customer not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # GET CUSTOMER ORDERS
        orders = (
            Order.objects
            .filter(
                customer=customer
            )
            .select_related(
                "customer",
                "address"
            )
            .prefetch_related(
                "items__dish__restaurant"
            )
            .order_by(
                "-created_at"
            )
        )

        # SERIALIZER
        serializer = OrderSerializer(
            orders,
            many=True
        )

        # RESPONSE
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class PartnerOrdersView(APIView):
    def get(self, request):
        partner_id = request.session.get("partner_id")
        if not partner_id:
            return Response(
                {"error": "Partner is not logged in."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            partner = RestaurantPartner.objects.get(
                id=partner_id
            )
        except RestaurantPartner.DoesNotExist:
            return Response(
                {"error": "Partner not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        restaurants = Restaurant.objects.filter(
            partner=partner
        )
        orders = (
            Order.objects
            .filter(
                items__dish__restaurant__in=restaurants
            )
            .select_related(
                "customer",
                "address"
            )
            .prefetch_related(
                "items__dish__restaurant"
            )
            .distinct()
            .order_by("-created_at")
        )
        order_data = []

        for order in orders:
            order_items = []
            partner_subtotal = Decimal("0.00")

            for item in order.items.all():
                dish = item.dish
                restaurant = dish.restaurant

                if restaurant.partner_id != partner.id:
                    continue
                item_price = Decimal(str(item.price))
                item_total = (
                    item_price * item.quantity
                )

                partner_subtotal += item_total
                order_items.append({
                    "id": item.id,
                    "dish": {
                        "id": dish.id,
                        "name": dish.name,
                        "description": dish.description,
                        "price": float(dish.price),
                        "image": (
                            request.build_absolute_uri(
                                dish.image.url
                            )
                            if dish.image
                            else None
                        ),
                    },
                    "quantity": item.quantity,
                    "price": float(item.price),
                    "item_total": float(item_total),
                    "restaurant": {
                        "id": restaurant.id,
                        "name": restaurant.name,
                        "address": restaurant.address,
                        "city": restaurant.city,
                        "state": restaurant.state,
                        "pincode": restaurant.pincode,
                    }
                })

            if not order_items:
                continue
            # CUSTOMER
            customer_data = {
                "id": order.customer.id,
                "name": order.customer.name,
                "phone_number": getattr(
                    order.customer,
                    "phone_number",
                    None
                ),
            }

            # DELIVERY ADDRESS
            address = order.address
            address_data = {
                "id": address.id,
                "flat_no": address.flat_no,
                "area": address.area,
                "landmark": address.landmark,
                "city": address.city,
                "state": address.state,
                "pincode": address.pincode,
                "full_address": (
                    f"{address.flat_no}, "
                    f"{address.area}"
                    + (
                        f", {address.landmark}"
                        if address.landmark
                        else ""
                    )
                    + f", {address.city}"
                    + f", {address.state}"
                    + f" - {address.pincode}"
                ),
            }

            # RESTAURANT
            restaurant = order_items[0]["restaurant"]
            # BILL
            delivery_fee = Decimal(
                str(order.delivery_fee)
            )
            total_amount = (
                partner_subtotal +
                delivery_fee
            )

            # ORDER DATA
            order_data.append({
                "id": order.id,
                "status": order.status,
                "created_at": order.created_at,
                "restaurant": restaurant,
                "customer": customer_data,
                "address": address_data,
                "items": order_items,
                "bill": {
                    "subtotal": float(
                        partner_subtotal
                    ),

                    "delivery_fee": float(
                        delivery_fee
                    ),
                    "total": float(
                        total_amount
                    ),
                },
            })
        return Response(
            order_data,
            status=status.HTTP_200_OK
        )