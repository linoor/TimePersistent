# Create your views here.
import json

from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.shortcuts import render
from django.utils.timezone import now
from rest_framework.decorators import api_view
from rest_framework.exceptions import ParseError

from main.models import Voyage, Place


@api_view(['POST'])
def start_voyage(request):
    # TODO write all of the correct arguments when bad request
    if request.method == 'POST':
        if not request.data:
            raise ParseError("You should provide from, to, note, type")
        r = request.data
        voyage = Voyage()
        voyage.time_started = now()
        voyage.note = json.dumps(r['note'])
        try:
            from_place = Place.objects.get(name=r['from_place'])
            voyage.from_place = from_place
        except Place.DoesNotExist:
            place = Place()
            place.name = r['from_place']
            place.save()
            voyage.from_place = place
        try:
            to_place = Place.objects.get(name=r['to_place'])
            voyage.to_place = to_place
        except Place.DoesNotExist:
            place = Place()
            place.name = r['to_place']
            place.save()
            voyage.to_place = place

        voyage.save()
        return JsonResponse({
            "id": voyage.id
        })
    else:
        return HttpResponseNotFound('<h1>Page not found</h1>')


@api_view(['POST'])
def stop_voyage(request):
    if request.method == 'POST':
        voyage = Voyage.objects.latest('time_started')
        if voyage.time_ended:
            return HttpResponse("Voyage {id} has already been stopped".format(id=voyage.id))
        voyage.time_ended = now()
        voyage.save()
        return HttpResponse("Voyage {id} has been stopped".format(id=voyage.id))


def main(request):
    return render(request, template_name="main.html")