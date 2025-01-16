import json
import asyncio

from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder


from chat_api.models import *
from chat_api.serializers import *


def get_data(serializer):
    return serializer.data


def create_group(model_instance, user1_instance, user2_instance):
    model_instance.group_users.add(user1_instance,user2_instance)
    model_instance.save()
    return model_instance

def add_group_to_contacts(model_instance, group_instance):
    model_instance.contacts.add(group_instance)
    model_instance.save()
    return model_instance



class ChatConsumer(AsyncWebsocketConsumer): # USE THIS INSTED OF ABOVE ONE



    async def connect(self):

        print(self.scope['user'])


        user = await Contacts.objects.aget(user = self.scope['user'])
        self.user_group_name = str(user.user_group_name)


        contact_serializer = await database_sync_to_async(ContactsSerializer)(user)
        contacts = await database_sync_to_async(get_data)(contact_serializer)
        user_contacts_objects = await database_sync_to_async(list)(UsersContacts.objects.filter(user=user.id))
        print(user_contacts_objects)

        user_contact_serializer = await database_sync_to_async(UsersContactsSerializer)(user_contacts_objects, many=True)
        user_contacts = await database_sync_to_async(get_data)(user_contact_serializer)

        if(len(contacts['contacts']) != 0):
            for i in contacts['contacts']:
                await self.channel_layer.group_add(i['group_name'], self.channel_name)
        # Join room group
        await self.channel_layer.group_add(self.user_group_name, self.channel_name)

        await self.accept()
        msg = {
            "type":"CHAT_LOADED",
            "data": {
                "contacts":contacts,
                "user_contacts":user_contacts,
            }
        }
        await self.send(json.dumps(msg,cls=DjangoJSONEncoder))



    async def disconnect(self, close_code):
        # Leave room group

        print("Going to disconnect")

        user = await Contacts.objects.aget(user = self.scope['user'])
        contact_serializer = await database_sync_to_async(ContactsSerializer)(user)
        contacts = await database_sync_to_async(get_data)(contact_serializer)
        if(len(contacts['contacts']) != 0):
            for i in contacts['contacts']:
                await self.channel_layer.group_discard(i['group_name'], self.channel_name)
        # Join room group
        await self.channel_layer.group_discard(self.user_group_name, self.channel_name)
    

    # Receive message from WebSocket
    async def receive(self, text_data):

        text_data_json = json.loads(text_data)
        group_name = text_data_json['group_name']
        print(text_data_json)
        # Send message to room group
        await self.channel_layer.group_send(
            group_name, text_data_json
        )
    async def chat_add_contact(self,event):
        data = event['data']
        print(data)
        msg = {}
        user_exists = await database_sync_to_async(list)(ChatUser.objects.filter(mobile = data['mobile']))
        if len(user_exists) != 0:

            # Get the contact instance
            get_contact = await ChatUser.objects.aget(mobile = data['mobile'])
            user_contact_exists = await database_sync_to_async(list)(UsersContacts.objects.filter(user=self.scope['user'],contact_id=get_contact))
            if (len(user_contact_exists) == 0): # user_contacts does not exists
                await UsersContacts.objects.acreate(user=self.scope['user'], contact_name=data['name'],contact_id=get_contact)

                # check if any group exists
                any_group_exists = await database_sync_to_async(list)(ChatGroups.objects.filter(group_users__mobile=self.scope['user'].mobile).filter(group_users__mobile=data['mobile']))
                if(len(any_group_exists) == 0): #Group doesnot exists create a group betwwen two user

                    cg = await ChatGroups.objects.acreate()
                    created_group = await database_sync_to_async(create_group)(cg,self.scope['user'],get_contact)
                    print(created_group)
                    print(cg)
                    # Add the created group to the Contacts
                    user_contacts_model_instance = await Contacts.objects.aget(user=self.scope['user'])
                    await database_sync_to_async(add_group_to_contacts)(user_contacts_model_instance,cg)

                
                    new_contact_model_instance = await Contacts.objects.aget(user=get_contact)
                    await database_sync_to_async(add_group_to_contacts)(new_contact_model_instance,cg)

                    user_contacts_object = await UsersContacts.objects.aget(user=self.scope['user'],contact_id=get_contact)
                    user_contact_serializer = await database_sync_to_async(UsersContactsSerializer)(user_contacts_object)
                    user_contacts = await database_sync_to_async(get_data)(user_contact_serializer)
                    msg['type']= 'CONTACTS_ADDED'
                    msg['data']= user_contacts
                else:
                    user_contacts_object = await UsersContacts.objects.aget(user=self.scope['user'],contact_id=get_contact)
                    user_contact_serializer = await database_sync_to_async(UsersContactsSerializer)(user_contacts_object)
                    user_contacts = await database_sync_to_async(get_data)(user_contact_serializer)
                    msg['type']= 'CONTACTS_ADDED'
                    msg['data']= user_contacts
            else:
                msg['type']= 'FAILED_ADDING_CONTACTS'
                msg['data']= "Contact Already Exists" 
            pass
        else:
            msg['type']= 'FAILED_ADDING_CONTACTS'
            msg['data']= "Invalid User"

        await self.send(text_data=json.dumps(msg))

    # Receive message from room group
    async def chat_message(self, event):
        data = event["data"]
        print(data)

        # Add message to the Model
        Messages.objects.acreate(**data)

        msg = {}
        msg['type']= 'MESSAGE_RECEIVED'
        msg['data']= data
        # Send message to WebSocket
        await self.send(text_data=json.dumps(msg,cls=DjangoJSONEncoder))
