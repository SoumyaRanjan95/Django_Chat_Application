# chat/routing.py
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<user>[A-Za-z0-9_-]+)/$", consumers.ChatConsumer.as_asgi()), # URL for the Websocket
]