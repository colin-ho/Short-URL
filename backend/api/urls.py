from django.urls import path
from . import views

urlpatterns = [
    path('create-shortened-url', views.create_shortened_url),
    path('check-click-count', views.check_click_count),
    path('<str:short_url>', views.redirect_url),
]