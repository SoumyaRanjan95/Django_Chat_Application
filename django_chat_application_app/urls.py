from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView


from .views import *

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='index'), # URL for the homepage
    path('login/', user_login, name='login'), # URL for login page
    path('register/', register, name='register'), # URL for register page
    path('chat/', chat, name='chat'), # URL for the chat application
    path('<path:route>',TemplateView.as_view(template_name='html_404.html'), name='not_found_404'), # Any other URLs throws an Error Page

]