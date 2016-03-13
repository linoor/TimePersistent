from django.contrib import admin

# Register your models here.
from main.models import Voyage, Place


class VoyageAdmin(admin.ModelAdmin):
    pass


admin.site.register(Voyage, VoyageAdmin)


class PlaceAdmin(admin.ModelAdmin):
    pass


admin.site.register(Place, PlaceAdmin)
