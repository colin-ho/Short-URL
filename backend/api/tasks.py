from celery import shared_task
from .models import UrlShortener
from django.db.models import F

@shared_task
def increment_click(short_url):
    UrlShortener.objects.filter(short_url=short_url).update(clicks=F('clicks')+1)