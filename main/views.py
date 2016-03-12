from datetime import datetime

# Create your views here.
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt

from main.models import Voyage, Place


@csrf_exempt
def start_timer(request):
    if request.method == 'POST':
        if not request.POST or request.POST == {}:
            return HttpResponse(status=400)
        r = request.POST
        voyage = Voyage()
        voyage.time_started = now()
        voyage.note = r['note']
        try:
            from_place = Place.objects.get(name=r['from_place'])
            voyage.from_place = from_place
        except Place.DoesNotExist:
            place = Place()
            place.save()
            place.name = r['from_place']
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

