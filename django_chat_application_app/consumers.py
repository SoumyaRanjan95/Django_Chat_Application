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



"""
    Function to help run synchronous operations from async consumer by using database_sync_to_async

"""

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


class ChatConsumer(AsyncWebsocketConsumer): # Create an Async Consumer

    """
        Django Channels Async Consumer has three main methods:

        def connect():
            Handles the websocket connection when initiated and accepts the connection
            ...
        def disconnect():
            Handles disconnect
            ...
        def receive():
            Handles receiving message from the connected websocket
            ...

        Other methods declared are event handlers:
        Ex: 
            In every message received from websocket we need to include 

            {'type': 'somename1.somename2', .....}

            channels will automatically look for a method with the name
            def somename1_somename2():
                ....

    """

    async def connect(self):

        print(self.scope['user']) # Get the details of the currently logged in user


        user = await Contacts.objects.aget(user = self.scope['user']) #Asynchronously get the data from Contacts 
        self.user_group_name = str(user.user_group_name)



        contact_serializer = await database_sync_to_async(ContactsSerializer)(user)
        contacts = await database_sync_to_async(get_data)(contact_serializer)
        user_contacts_objects = await database_sync_to_async(list)(UsersContacts.objects.filter(user=user.id))

        user_contact_serializer = await database_sync_to_async(UsersContactsSerializer)(user_contacts_objects, many=True)
        user_contacts = await database_sync_to_async(get_data)(user_contact_serializer)

        if(len(contacts['contacts']) != 0):
            for i in contacts['contacts']:
                """
                    Channel support individuals channels and groups. See Django Channel Docs for more Details

                    Group feature is implemented here
                    Individually add group to the channel, so that any one with the name of the channel can send messages

                """
                await self.channel_layer.group_add(i['group_name'], self.channel_name)

        # To message self
        await self.channel_layer.group_add(self.user_group_name, self.channel_name)

        await self.accept() # Accept the connection

        # Message on succesful connection
        msg = {
            "type":"CHAT_LOADED", # type message for React Dispatch
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
                # discard from the channel layer on disconnect
                await self.channel_layer.group_discard(i['group_name'], self.channel_name)
        # Discard from the channel layer on disconnect
        await self.channel_layer.group_discard(self.user_group_name, self.channel_name)
    

    # Receive message from WebSocket
    async def receive(self, text_data):

        """
            data is received from React as JSON 

            {
                'type': '<__eventname__>',
                'data': ....,
                .....
            }

            type determines which event handler will be fired to receive the event from the group
        """

        text_data_json = json.loads(text_data)
        group_name = text_data_json['group_name']

        # Send message to specific room group
        await self.channel_layer.group_send(
            group_name, text_data_json
        )
    
    # Event handler functions to be fired on 'type': 'chat.add_contact' to receive message from room group
    async def chat_add_contact(self,event):
        data = event['data']
        msg = {}

        # Check if the user requested to be added exists or not
        user_exists = await database_sync_to_async(list)(ChatUser.objects.filter(mobile = data['mobile'])) # returns a list
        if len(user_exists) != 0: # if the user exists

            # Get the contact instance which was requested to be added
            get_contact = await ChatUser.objects.aget(mobile = data['mobile'])

            # Check if the user exists in the user contacts list already
            user_contact_exists = await database_sync_to_async(list)(UsersContacts.objects.filter(user=self.scope['user'],contact_id=get_contact))
            if (len(user_contact_exists) == 0): # user_contacts does not exists
                await UsersContacts.objects.acreate(user=self.scope['user'], contact_name=data['name'],contact_id=get_contact)

                # check if any group exists(i.e., someone else had already added them to their contact list and created a channel group)
                any_group_exists = await database_sync_to_async(list)(ChatGroups.objects.filter(group_users__mobile=self.scope['user'].mobile).filter(group_users__mobile=data['mobile']))

                if(len(any_group_exists) == 0): #Group doesnot exists create a group betwwen two user

                    cg = await ChatGroups.objects.acreate()
                    created_group = await database_sync_to_async(create_group)(cg,self.scope['user'],get_contact)

                    # Add the created group to the authenticated users Contacts
                    user_contacts_model_instance = await Contacts.objects.aget(user=self.scope['user'])
                    await database_sync_to_async(add_group_to_contacts)(user_contacts_model_instance,cg)

                    # Add the created group to the other users Contacts
                    new_contact_model_instance = await Contacts.objects.aget(user=get_contact)
                    await database_sync_to_async(add_group_to_contacts)(new_contact_model_instance,cg)

                    # Add group to the users contact list
                    user_contacts_object = await UsersContacts.objects.aget(user=self.scope['user'],contact_id=get_contact)
                    user_contact_serializer = await database_sync_to_async(UsersContactsSerializer)(user_contacts_object)
                    user_contacts = await database_sync_to_async(get_data)(user_contact_serializer)


                    # get the recently created group name for serialization
                    to_group_serializers =  await database_sync_to_async(get_chat_groups_to_serialize)(self.scope['user'],get_contact)
                    group_serializers = await database_sync_to_async(GroupSerializers)(to_group_serializers)
                    to_chat_state = await database_sync_to_async(get_data)(group_serializers)

                    # add the newly created group to channel layers
                    await self.channel_layer.group_add(to_chat_state['group_name'], self.channel_name)

                    # send the data to update the chat state in React
                    data = {
                        'to_chat_state': to_chat_state,
                        'user_contacts':user_contacts
                    }

                    msg['type']= 'CONTACTS_ADDED'
                    msg['data']= data

                else: # Group already exists
                
                    # Add group to the users contact list
                    user_contacts_object = await UsersContacts.objects.aget(user=self.scope['user'],contact_id=get_contact)
                    user_contact_serializer = await database_sync_to_async(UsersContactsSerializer)(user_contacts_object)
                    user_contacts = await database_sync_to_async(get_data)(user_contact_serializer)

                    # get the recently created group name for serialization
                    to_group_serializers =  await database_sync_to_async(get_chat_groups_to_serialize)(self.scope['user'],get_contact)
                    group_serializers = await database_sync_to_async(GroupSerializers)(to_group_serializers)
                    to_chat_state = await database_sync_to_async(get_data)(group_serializers)

                    # add the newly created group to channel layers
                    await self.channel_layer.group_add(to_chat_state['group_name'], self.channel_name)

                    # send the data to update the chat state in React
                    data = {
                        'to_chat_state': to_chat_state,
                        'user_contacts':user_contacts
                    }

                    msg['type']= 'CONTACTS_ADDED'
                    msg['data']= data

            else: # Cannot add the same user twice if it already exists in the contact list
                msg['type']= 'FAILED_ADDING_CONTACTS'
                msg['data']= "Contact Already Exists" 
            pass
        else: # The user doesnot exists
            msg['type']= 'FAILED_ADDING_CONTACTS'
            msg['data']= "Invalid User"

        await self.send(text_data=json.dumps(msg))

    # Event handler functions to be fired on 'type': 'chat.message' to receive message from room group
    async def chat_message(self, event):
        data = event["data"]

        """
            messages recieved are in the format
            {
                'to':'0x0x0x0x0x',
                'from_user':'0x0x0x0x0x',
                'group_name':'<__UUID Field__>',
                'content':'Some message ...',
                timestamp: '<__date in ISO String format__>'
            }
        """

        # Convert the received messages to the instances of the models
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


        """
            Instances are not JSON serializable therefore convert them back to the strings
        """

        data['to']=data['to'].mobile
        data['from_user']=data['from_user'].mobile
        data['group_name']=data['group_name'].group_name

        msg = {}
        msg['type']= 'MESSAGE_RECEIVED'
        msg['data']= data

        # Send message to WebSocket
        await self.send(text_data=json.dumps(msg,cls=DjangoJSONEncoder))
