# Create your views here.
import json

from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.shortcuts import render, redirect
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
        voyage.type = r['type']
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
            "id": voyage.id,
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
        voyage.duration = (voyage.time_ended - voyage.time_started).seconds
        voyage.save()
        return HttpResponse("Voyage {id} has been stopped".format(id=voyage.id))


def main(request):
    return render(request, template_name="index.html")


@api_view(['GET'])
def voyage(request, voyage_id=None):
    if request.method == 'GET':
        try:
            if voyage_id:
                voyage = Voyage.objects.get(pk=voyage_id)
            else:
                # last voyage
                voyage = Voyage.objects.latest('time_started')

            return JsonResponse({
                'id': voyage.id,
                'time_started': voyage.time_started,
                "from_place": str(voyage.from_place),
                "to_place": str(voyage.to_place),
                'time_ended': voyage.time_ended,
                'type': voyage.type,
                'duration': voyage.duration
            })
        except Voyage.DoesNotExist:
            return JsonResponse({})


@api_view(['GET'])
def stats_json(request):
    pass


def voyage_show(request, voyage_id):
    return render(request, template_name="voyage.html")


def voyage_show_last(request):
    return redirect('/voyage/%d' % Voyage.objects.latest('time_started').id)


def modify_voyage(oper):
    if oper == 'add':
        @api_view(['POST'])
        def fun(request, voyage_id):
            voyage = Voyage.objects.get(pk=voyage_id)
            voyage.duration += 60
            voyage.save()
            return HttpResponse('Time has been added successfully')
    elif oper == 'decrease':
        @api_view(['POST'])
        def fun(request, voyage_id):
            voyage = Voyage.objects.get(pk=voyage_id)
            if voyage.duration >= 60:
                voyage.duration -= 60
                voyage.save()
            return HttpResponse('Time has been decreased successfully')
    return fun
