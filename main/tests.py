import json

from django.test import TestCase

# Create your tests here.
from main.models import Voyage, Place


class Tests(TestCase):
    def test_bad_request(self):
        r = self.client.post("/start_voyage", data={})
        self.assertEqual(r.status_code, 400)

    def test_get_id(self):
        r = self.client.post("/start_voyage", data={
            "note": "asd",
            "type": "asd",
            "to_place": "asd",
            "from_place": "asd",
        })
        self.assertEqual(r'{"id": 1}', r.content)
        self.assertEqual(Voyage.objects.all().count(), 1)

    def test_stop_voyage_stops_last_started(self):
        self.assertEqual(Voyage.objects.all().count(), 0)
        r = self.client.post("/start_voyage", data={
            "note": "asd",
            "type": "asd",
            "to_place": "asd",
            "from_place": "asd",
        })
        id = json.loads(r.content)['id']
        self.assertEqual(Voyage.objects.all().count(), 1)
        r = self.client.post("/stop_voyage", data={})
        self.assertEqual("Voyage {id} has been stopped".format(id=id), r.content)
        self.assertIsNotNone(Voyage.objects.latest('time_started'))

    def test_only_adds_place_once(self):
        self.assertEqual(Place.objects.all().count(), 0)
        r = self.client.post("/start_voyage", data={
            "note": "asd",
            "type": "asd",
            "to_place": "asd",
            "from_place": "asd2",
        })
        self.assertEqual(Place.objects.all().count(), 2)
        r = self.client.post("/start_voyage", data={
            "note": "asd",
            "type": "asd",
            "to_place": "asd",
            "from_place": "asd2",
        })
        self.assertEqual(Place.objects.all().count(), 2)

    def test_get_last_started_voyage_if_started(self):
        r = self.client.post("/start_voyage", data={
            "note": "asd",
            "type": "asd",
            "to_place": "asd",
            "from_place": "asd2",
        })
        latest_started = Voyage.objects.latest('time_started')
        r = self.client.get('/voyage')
        data = json.loads(r.content)
        self.assertEqual(data['id'], latest_started.id)
        self.assertIsNotNone(data['time_started'])

    def test_get_empty_json_if_not_started(self):
        r = self.client.get('/voyage')
        data = json.loads(r.content)
        self.assertEqual({}, data)

