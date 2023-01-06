from django.db import models

class UrlShortener(models.Model):
    long_url = models.CharField(max_length=255)
    short_url = models.CharField(max_length=10)
    clicks = models.IntegerField(default=0)
    def __str__(self):
        return self.short_url+" "+str(self.clicks)