from __future__ import unicode_literals

from time import timezone

import pytz as pytz
from django.contrib.postgres.fields import JSONField
from django.db import models
from rest_framework import serializers


class Place(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(blank=True, max_length=50)

    def __repr__(self):
        return str(self.name)

    def __str__(self):
        return str(self.name)


class Voyage(models.Model):
    time_started = models.DateTimeField(blank=False)
    time_ended = models.DateTimeField(blank=True, null=True)
    type = models.CharField(max_length=50)
    duration = models.PositiveIntegerField(default=0)
    from_place = models.ForeignKey(Place, related_name="from_place")
    to_place = models.ForeignKey(Place, related_name="to_place")
    note = JSONField(blank=True)

    def __repr__(self):
        return "id: {id}, time started: {time_started}, time ended: {time_ended}, type: {type}".format(
            id=self.id,
            time_started=self.time_started,
            time_ended=self.time_ended,
            type=self.type
        )

    def __str__(self):
        timezone = pytz.timezone('Poland')
        return '{date}'.format(
                date=self.time_started.strftime('%Y-%m-%d'),
               ) + \
               '-' * 10 + \
               '{time_1} - {time_2} '.format(
                    time_1=self.time_started.astimezone(timezone).strftime('%H:%M'),
                    time_2=self.time_ended.astimezone(timezone).strftime('%H:%M') if self.time_ended else '',
               ) + \
               '({time_elapsed} min) '.format(
                   time_elapsed=self.duration / 60
               ).ljust(20, '-') + \
               ' {from_place} '.format(
                   from_place=self.from_place
               ).ljust(20, '-') + \
               '> {to_place} '.format(
                   to_place=self.to_place,
               ).ljust(20, '-') + \
               ' {type}'.format(
                   type=self.type,
               )
