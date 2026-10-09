from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from restaurants.models import Restaurant
from .serializers import DishSerializer
from .models import Dish

# Create your views here.
class DishView(APIView):
    def post(self,request):
        restaurant_id=request.data.get("restaurant_id")

        if not restaurant_id:
            return Response(
                {"error":"restaurant_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            restaurant=Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response(
                {"error":"Restaurant not found"},
                status=status.HTTP_400_BAD_REQUEST
            )    
        serializer=DishSerializer(data=request.data)
        if serializer.is_valid():
            dish=serializer.save(restaurant=restaurant)
            return Response(
                DishSerializer(dish).data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # GET DISH
    def get(self, request, pk):
        try:
            dish = Dish.objects.get(id=pk)
        except Dish.DoesNotExist:
            return Response(
                {"error": "Dish not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = DishSerializer(dish)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # Update Dish
    def patch(self, request, pk):
        try:
            dish = Dish.objects.get(id=pk)
        except Dish.DoesNotExist:
            return Response(
                {"error": "Dish not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Save old image before updating
        old_image = dish.image

        serializer = DishSerializer(
            dish,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            dish = serializer.save()

            # If a new image was uploaded, delete the old image
            if "image" in request.FILES and old_image:
                old_image.delete(save=False)

            return Response(
                DishSerializer(dish).data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # DELETE DISH
    def delete(self, request, pk):
        try:
            dish = Dish.objects.get(id=pk)
        except Dish.DoesNotExist:
            return Response(
                {"error": "Dish not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        # Store image before deleting the dish
        image = dish.image

        # Delete database record
        dish.delete()

        # Delete physical image file
        if image:
            image.delete(save=False)

        return Response(
            {"message": "Dish deleted successfully"},
            status=status.HTTP_200_OK
        )

# All dishes
class RestaurantDishesView(APIView):

    def get(self, request, pk):
        try:
            restaurant = Restaurant.objects.get(id=pk)
        except Restaurant.DoesNotExist:
            return Response(
                {"error": "Restaurant not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        dishes = Dish.objects.filter(
            restaurant=restaurant
        )
        serializer = DishSerializer(
            dishes,
            many=True,
            context={"request": request}
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class CustomerRestaurantDishesView(APIView):

    def get(self, request, pk):

        try:
            restaurant = Restaurant.objects.get(
                id=pk,
                is_active=True
            )

        except Restaurant.DoesNotExist:

            return Response(
                {"detail": "Restaurant not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        dishes = restaurant.dishes.all()

        serializer = DishSerializer(
            dishes,
            many=True
        )

        return Response(serializer.data)