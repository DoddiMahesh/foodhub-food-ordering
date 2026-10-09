from django.urls import path
from .views import RestaurantView,MyRestaurantsView,RestaurantDetailsView,CustomerRestaurantListView,CustomerRestaurantDetailsView, RestaurantSearchView

urlpatterns = [
    path("partner/restaurant/add/", RestaurantView.as_view()),
    path("partner/my-restaurants/", MyRestaurantsView.as_view()),
    path("partner/restaurant/<int:pk>/", RestaurantDetailsView.as_view()),
    path("partner/restaurant/<int:pk>/update/", RestaurantDetailsView.as_view()),
    path("partner/restaurant/<int:pk>/delete/", RestaurantDetailsView.as_view()),
    path("customer/restaurants/",CustomerRestaurantListView.as_view()),
    path("customer/restaurant/<int:pk>/", CustomerRestaurantDetailsView.as_view()),
    path("customer/restaurants/search/", RestaurantSearchView.as_view()),
]