from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
import datetime

import uuid

from rest_framework.authtoken.models import Token

from .manager import *

# Automatically create Tokens on new user, read Django Signals for more information
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

# Create your models here.
"""
    ChatUser models uses the Django's AbstractUser Class to retain features of the User model while adding new fields
    For a completely customized User Model use the AbstractBaseUser Class, see docs for more inforamtion

    For customized user model, you need to provide your own user Manager Class to create user and superuser
    and specify the UserCreation Form and UserChangeForm in forms.py to register them to the admin interface
    
"""
class ChatUser(AbstractUser):
    username = None # Nullify the default username field
    mobile = models.CharField(max_length=15, unique=True)
    name = models.CharField(max_length=90, default='Anonymous')
    USERNAME_FIELD = 'mobile' # use the mobile field as the default username field
    objects = ChatUserManager() # to handle the attributes defined in the manager class

class ChatGroups(models.Model):
    group_name = models.UUIDField(unique=True,auto_created=True,editable=False, default=uuid.uuid4)
    group_users = models.ManyToManyField(ChatUser,related_name='group_users')
    last_message_time = models.DateTimeField(default=datetime.datetime.now().isoformat())

class Contacts(models.Model):
    user = models.OneToOneField(ChatUser, on_delete=models.CASCADE, related_name='user')
    user_group_name = models.UUIDField(unique=True,auto_created=True,editable=False, default=uuid.uuid4) #prefix="biz_"
    contacts = models.ManyToManyField(ChatGroups, related_name='user_contacts',blank=True)

class UsersContacts(models.Model):
    user = models.ForeignKey(ChatUser, on_delete=models.CASCADE, related_name='user_contacts')
    contact_name = models.CharField(max_length=90)
    contact_id = models.ForeignKey(ChatUser, on_delete=models.CASCADE, related_name='contact_mob')


class Messages(models.Model):
    to = models.ForeignKey(ChatUser, on_delete=models.CASCADE, related_name='receiver')
    from_user = models.ForeignKey(ChatUser, on_delete=models.CASCADE, related_name='sender')
    group_name = models.ForeignKey(ChatGroups, on_delete=models.CASCADE, related_name='receiver_sender_group')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


# Automatically create a contact object on ChatUser object creation
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_contacts(sender, instance=None, created=False, **kwargs):
    if created:
        Contacts.objects.create(user=instance)