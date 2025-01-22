from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView


from .views import *

"""
    URL patterns for using the Django Restframeworks Browsable API
    URLs are : 
    api/register/
    api/login/
    api/logout/
    
"""
urlpatterns = [
    path('register/',ChatUserCreationView.as_view(),name='register-api'),
    path('login/',ChatUserLoginView.as_view(),name='login-api'),
    path('logout/',LogoutView.as_view(),name='logout-api'),

]