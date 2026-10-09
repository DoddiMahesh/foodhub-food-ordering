from django.urls import path
from .views import DishView,RestaurantDishesView,CustomerRestaurantDishesView

urlpatterns = [
    path("partner/dish/add/", DishView.as_view()),
    path("partner/dish/<int:pk>/", DishView.as_view()),
    path("partner/restaurant/<int:pk>/dishes/", RestaurantDishesView.as_view()),
    path("partner/dish/<int:pk>/edit/",DishView.as_view()),
    path("partner/dish/<int:pk>/delete/", DishView.as_view()),
    path("customer/restaurant/<int:pk>/dishes/", CustomerRestaurantDishesView.as_view()),
]