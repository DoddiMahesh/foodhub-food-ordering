from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.models import RestaurantPartner
from .models import Restaurant
from dishes.models import Dish
from .serializers import RestaurantSerializer

# Create your views here.

#RESTAURANT VIEWS
class RestaurantView(APIView):
    def post(self,request):
        partner_id=request.session.get("partner_id")
        if not partner_id:
            return Response({"error":"partner is not logged in"},
                                status=status.HTTP_400_BAD_REQUEST
                            )
        try:
            partner=RestaurantPartner.objects.get(id=partner_id)
        except RestaurantPartner.DoesNotExist:
            return Response(
                {"error":"Restaurant partner not found"},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer=RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            restaurant=serializer.save(partner=partner)
            return Response(
                RestaurantSerializer(restaurant).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class MyRestaurantsView(APIView):
    def get(self,request):
        partner_id=request.session.get("partner_id")
        if not partner_id:
            return Response(
                {"error":"Partner not logged in"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        restaurants=Restaurant.objects.filter(partner_id=partner_id)
        serializer=RestaurantSerializer(restaurants,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class RestaurantDetailsView(APIView):
    #Get Restaurant
    def get(self,request,pk):
        partner_id=request.session.get("partner_id")

        if not partner_id:
            return Response(
                {"error":"Partner is not logged in"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            restaurant=Restaurant.objects.get(id=pk,partner_id=partner_id)
        except Restaurant.DoesNotExist:
            return Response(
                {"error":"Restaurant not found"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        serializer=RestaurantSerializer(restaurant)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # Edit Restaurant
    def put(self,request,pk):
            print("REQUEST DATA:", request.data)
            print("REQUEST FILES:", request.FILES)
            partner_id=request.session.get("partner_id")
    
            if not partner_id:
                return Response(
                    {"error":"Partner is not logged in"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            try:
                restaurant=Restaurant.objects.get(id=pk,partner_id=partner_id)
            except Restaurant.DoesNotExist:
                return Response(
                    {"error":"Restaurant not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            data=request.data.copy()
            if "image" not in request.FILES:
                data.pop("image",None)
            print("FINAL DATA:", data)
            print("FILES:", request.FILES)

            serializer=RestaurantSerializer(restaurant,data=data,partial=True)
            if serializer.is_valid():
                restaurant=serializer.save()
                return Response(RestaurantSerializer(restaurant).data,status=status.HTTP_200_OK)
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

    #Delete Restaurant
    def delete(self,request,pk):
            partner_id=request.session.get("partner_id")
    
            if not partner_id:
                return Response(
                    {"error":"Partner is not logged in"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            try:
                restaurant=Restaurant.objects.get(id=pk,partner_id=partner_id)
            except Restaurant.DoesNotExist:
                return Response(
                    {"error":"Restaurant not found"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            restaurant.delete()
            return Response(
                {'message':"Restaurant deleted successfully"},
                status=status.HTTP_200_OK
            )

# Customer see all restautrants
class CustomerRestaurantListView(APIView):
    def get(self, request):
        restaurants = Restaurant.objects.filter(is_active=True)
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class CustomerRestaurantDetailsView(APIView):

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

        serializer = RestaurantSerializer(restaurant)

        return Response(serializer.data)

from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Restaurant
from .serializers import RestaurantSerializer
from dishes.models import Dish


class RestaurantSearchView(APIView):

    def get(self, request):

        search = request.GET.get("search", "").strip()

        restaurants = Restaurant.objects.filter(
            is_active=True
        )

        if search:

            restaurants = restaurants.filter(
                Q(name__icontains=search) |
                Q(city__icontains=search) |
                Q(state__icontains=search) |
                Q(food_types__icontains=search) |
                Q(
                    id__in=Dish.objects.filter(
                        Q(name__icontains=search) |
                        Q(category__icontains=search)
                    ).values("restaurant_id")
                )
            ).distinct()

        serializer = RestaurantSerializer(
            restaurants,
            many=True,
            context={"request": request}
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
     