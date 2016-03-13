from __future__ import unicode_literals

from django.contrib.postgres.fields import JSONField
from django.db import models


class Place(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(blank=True, max_length=50)

    def __str__(self):
        return self.name


class Voyage(models.Model):
    time_started = models.DateTimeField(blank=False)
    time_ended = models.DateTimeField(blank=True, null=True)
    type = models.CharField(max_length=50)
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
        return "id: {id}, time started: {time_started}, " \
               "time ended: {time_ended}, type: {type}, " \
               "from place: {from_place}, to place: {to_place}".format(
            id=self.id,
            time_started=self.time_started,
            time_ended=self.time_ended,
            type=self.type,
            from_place=self.from_place,
            to_place=self.to_place
        )
