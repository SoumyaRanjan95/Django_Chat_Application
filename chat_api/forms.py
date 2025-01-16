from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import *


class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = ChatUser
        fields = ("mobile",)


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = ChatUser
        fields = ("mobile",)