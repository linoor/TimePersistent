from django.test import TestCase


# Create your tests here.
from main.models import Voyage


class Tests(TestCase):

    def test_bad_request(self):
        r = self.client.post("/start_timer", data={})
        self.assertEqual(r.status_code, 400)

    def test_get_id(self):
        r = self.client.post("/start_timer", data={
            "note": "asd",
            "type": "asd",
            "to_place": "asd",
            "from_place": "asd",
        })
        self.assertEqual(r'{"id": 1}', r.content)
        self.assertEqual(Voyage.objects.all().count(), 1)
