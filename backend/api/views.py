from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import UrlShortener
from django.core.cache import cache
from api.tasks import increment_click

@api_view(['POST'])
def create_shortened_url(request):
    data = request.data
    long_url, short_url= data['long_url'], data['short_url']

    if len(short_url) > 10:
        return Response({'status':'fail', 'message':'10 characters max ;('})

    if not long_url.startswith('http://') and not long_url.startswith('https://'):
        long_url = "https://"+long_url

    try:
        inCache = cache.get(short_url)
        if inCache:
            return Response({'status':'fail', 'message':'Path taken, try again!'})
    
        UrlShortener.objects.get(short_url=short_url)
        return Response({'status':'fail', 'message':'Path taken, try again!'})

    except UrlShortener.DoesNotExist:
        UrlShortener.objects.create(
            long_url=long_url,
            short_url=short_url,
            clicks=0,
        )
        cache.set(short_url,long_url)
        return Response({'status':'success','short_url': short_url})

@api_view(['POST'])
def check_click_count(request):
    data = request.data
    short_url= data['short_url']

    if len(short_url) > 10:
        return Response({'status':'fail', 'message':'Link does not exist ;('})

    try:
        obj = UrlShortener.objects.get(short_url=short_url)
        return Response({'status':'success', 'clicks':obj.clicks})

    except UrlShortener.DoesNotExist:
        return Response({'status':'fail', 'message':'Link does not exist ;('})

def redirect_url(_request, short_url):
    try:
        long_url = cache.get(short_url)
        if long_url:
            increment_click.delay(short_url)
            return redirect(long_url)

        obj = UrlShortener.objects.get(short_url=short_url)

    except UrlShortener.DoesNotExist:
        obj = None

    if obj is not None:
        cache.set(short_url,obj.long_url)
        increment_click.delay(short_url)
        return redirect(obj.long_url)
    else:
        return redirect("/")