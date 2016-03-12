from __future__ import unicode_literals

from django.contrib.postgres.fields import JSONField
from django.db import models


class Place(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(blank=True, max_length=50)


class Voyage(models.Model):
    time_started = models.DateTimeField(blank=False)
    time_ended = models.DateTimeField(blank=False)
    type = models.CharField(max_length=50)
    from_place = models.ForeignKey(Place, related_name="from_place")
    to_place = models.ForeignKey(Place, related_name="to_place")
    note = JSONField(blank=True)
