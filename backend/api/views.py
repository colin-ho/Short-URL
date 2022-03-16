from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import UrlShortener

import random

@api_view(['POST'])
def makeshorturl(request):
    data = request.data
    s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    longurl = data['longurl']
    shorturl = ("".join(random.sample(s, 6)))
    while UrlShortener.objects.filter(shorturl = shorturl).count()>0:
        shorturl = ("".join(random.sample(s, 6)))
    UrlShortener.objects.create(
        longurl=longurl,
        shorturl=shorturl
    )
    shorturl = "http://localhost:8000/"+shorturl
    return Response({'longurl': longurl, 'shorturl': shorturl})


def redirectUrl(request, shorturl):
    try:
        obj = UrlShortener.objects.get(shorturl=shorturl)
    except UrlShortener.DoesNotExist:
        obj = None

    if obj is not None:
        return redirect(obj.longurl)