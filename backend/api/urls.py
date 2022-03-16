from django.urls import path
from . import views

urlpatterns = [
    path('shorten/', views.makeshorturl),
    path('<str:shorturl>', views.redirectUrl)
]