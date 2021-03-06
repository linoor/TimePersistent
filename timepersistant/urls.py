"""timepersistant URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.views.generic import RedirectView

from main import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^favicon\.ico$', RedirectView.as_view(url='/static/favicon.ico')),
    url(r'^voyage/([0-9]+)', views.voyage_show),
    url(r'^voyage/last', views.voyage_show_last),
    url(r'^api/start_voyage', views.start_voyage, name="start_voyage"),
    url(r'^api/stop_voyage', views.stop_voyage, name="stop_voyage"),
    url(r'^api/voyage/([0-9]+)/add-time', views.modify_voyage('add')),
    url(r'^api/voyage/([0-9]+)/decrease-time', views.modify_voyage('decrease')),
    url(r'^api/voyage/([0-9]+)', views.voyage),
    url(r'^api/voyage', views.voyage),
    url(r'^$', views.main, name="main"),
]
