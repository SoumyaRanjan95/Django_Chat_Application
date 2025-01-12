import json

from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder


from .models import *



class ChatConsumer(AsyncWebsocketConsumer): # USE THIS INSTED OF ABOVE ONE



    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]['user']
        self.room_group_name = f"{self.room_name}"

        print(self.scope)

        #value = await Contacts.objects.aget(user = self.scope['user'])
        #print(value)
        #groups = await database_sync_to_async(list)(value.contact.all())
        #print(list(groups))

        # Add all the group names on connect

        """        msg_data = {
                    "status":"online"
                }


                for i in groups:
                    print(i.group_name)
                    await self.channel_layer.group_add(str(i.group_name), self.channel_name)
                    id = await Groups.objects.aget(group_name = str(i.group_name))
                    other_member_in_group = await database_sync_to_async(get_contacts)(id,self.scope['user'])
                    print("Other memeber in group", other_member_in_group)
                    msg_data[str(i.group_name)] = {"details":other_member_in_group,"messages":await database_sync_to_async(list)(Messages.objects.filter(group_name =id ).values())}

        """
        # Join room group

        await self.accept()
        #await self.send(json.dumps(msg_data,cls=DjangoJSONEncoder))



    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):

        text_data_json = json.loads(text_data)
        print(text_data_json)

        room_group_name = text_data_json['group_name']

        to = await ChatUser.objects.aget(mobile = text_data_json["to"])
        fromm =  await ChatUser.objects.aget(mobile = text_data_json['from'])
        group_name  = await Groups.objects.aget(group_name = text_data_json['group_name'])
        message = text_data_json['message']
        timestamp = text_data_json['timestamp']

        await Messages.objects.acreate(to = to, from_user = fromm, group_name=group_name, content = message, timestamp = timestamp)


        # Send message to room group
        await self.channel_layer.group_send(
            room_group_name, {"type": "chat.message", "data": text_data_json}
        )

    # Receive message from room group
    async def chat_message(self, event):
        data = event["data"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"data": data}))
