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

def update_last_message_time(model_instance,time):
    model_instance.last_message_time = time
    model_instance.save()

def get_chat_groups_to_serialize(user1,user2):
    chat_group = ChatGroups.objects.filter(group_users__mobile=user1.mobile).filter(group_users__mobile=user2.mobile)[0]
    return chat_group

def save_message(msg):
    msg.save()


class ChatConsumer(AsyncWebsocketConsumer): # USE THIS INSTED OF ABOVE ONE



    async def connect(self):

        print(self.scope['user'])


        user = await Contacts.objects.aget(user = self.scope['user'])
        self.user_group_name = str(user.user_group_name)


        contact_serializer = await database_sync_to_async(ContactsSerializer)(user)
        contacts = await database_sync_to_async(get_data)(contact_serializer)
        user_contacts_objects = await database_sync_to_async(list)(UsersContacts.objects.filter(user=user.id))

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
        # Send message to room group
        
        await self.channel_layer.group_send(
            group_name, text_data_json
        )
    async def chat_add_contact(self,event):
        data = event['data']
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


                    # change from here
                    to_group_serializers =  await database_sync_to_async(get_chat_groups_to_serialize)(self.scope['user'],get_contact)
                    group_serializers = await database_sync_to_async(GroupSerializers)(to_group_serializers)
                    to_chat_state = await database_sync_to_async(get_data)(group_serializers)


                    await self.channel_layer.group_add(to_chat_state['group_name'], self.channel_name)

                    data = {
                        'to_chat_state': to_chat_state,
                        'user_contacts':user_contacts
                    }

                    msg['type']= 'CONTACTS_ADDED'
                    msg['data']= data
                else:
                    #new_contact_model_instance = await Contacts.objects.aget(user=get_contact)
                    #await database_sync_to_async(add_group_to_contacts)(new_contact_model_instance,any_group_exists[0])
                
                    user_contacts_object = await UsersContacts.objects.aget(user=self.scope['user'],contact_id=get_contact)
                    user_contact_serializer = await database_sync_to_async(UsersContactsSerializer)(user_contacts_object)
                    user_contacts = await database_sync_to_async(get_data)(user_contact_serializer)

                    # change from here

                    to_group_serializers =  await database_sync_to_async(get_chat_groups_to_serialize)(self.scope['user'],get_contact)
                    group_serializers = await database_sync_to_async(GroupSerializers)(to_group_serializers)
                    to_chat_state = await database_sync_to_async(get_data)(group_serializers)


                    await self.channel_layer.group_add(to_chat_state['group_name'], self.channel_name)

                    data = {
                        'to_chat_state': to_chat_state,
                        'user_contacts':user_contacts
                    }

                    msg['type']= 'CONTACTS_ADDED'
                    msg['data']= data
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

        to = await ChatUser.objects.aget(mobile=data['to'])
        from_user = await ChatUser.objects.aget(mobile = data['from_user'])
        group_name = await ChatGroups.objects.aget(group_name=data['group_name'])
        content = data['content']
        timestamp = data['timestamp']

        await database_sync_to_async(update_last_message_time)(group_name,timestamp)


        data = {
            'to' : to,
            'from_user':from_user,
            'group_name':group_name,
            'content':content,
            'timestamp':timestamp,
        }



        # Add message to the Model
        msg = await Messages.objects.acreate(**data)
        await database_sync_to_async(save_message)(msg)
        #await Messages.objects.acreate(to=to, from_user=from_user, group_name=group_name,content=content,timestamp=timestamp)
        data['to']=data['to'].mobile
        data['from_user']=data['from_user'].mobile
        data['group_name']=data['group_name'].group_name

        msg = {}
        msg['type']= 'MESSAGE_RECEIVED'
        msg['data']= data

        print(msg)
        # Send message to WebSocket
        await self.send(text_data=json.dumps(msg,cls=DjangoJSONEncoder))
