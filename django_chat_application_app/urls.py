from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView


from .views import *

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
    path('login/', user_login, name='login'),
    path('register/', register, name='register'),
    path('chat/', chat, name='chat'),
    path('chat/<path:route>',chat, name='to_be_handled_by_react'),
    path('<path:route>',TemplateView.as_view(template_name='html_404.html'), name='not_found_404'),

]