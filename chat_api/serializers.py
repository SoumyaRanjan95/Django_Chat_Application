from rest_framework import serializers

from .models import *


class ChatUserCreationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatUser
        fields = ['mobile','name','password']
        extra_kwargs = {'password':{'write_only':True}}

    def create(self, validated_data):
        user = ChatUser.objects.create_user(validated_data['mobile'],validated_data['password'])
        user.name = validated_data['name']
        user.save()
        return user

class ChatUserLoginSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatUser
        fields = ['mobile','password']
        extra_kwargs = {'password':{'write_only':True}}

    def to_representation(self,instance): 
        representation = super().to_representation(instance)
        

        representation['name'] = ChatUser.objects.get(mobile=representation['mobile']).name

        return representation
    

class ChatUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatUser
        fields = ['id','mobile']
    

class GroupSerializers(serializers.ModelSerializer):

    class Meta:
        model = ChatGroups
        fields = ['id','group_name']

    

class ContactsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contacts
        fields= ['id','user_group_name','user']
        


    def to_representation(self,instance): 
        representation = super().to_representation(instance)
        representation['name'] = ChatUser.objects.get(id=instance.id).name
        representation['mobile'] = ChatUser.objects.get(id=instance.id).mobile
        contacts_list = []
        for contact in instance.contacts.all():
            group_users = list(contact.group_users.all().values('id','mobile'))
            msg_list = list(Messages.objects.filter(group_name=contact.id).values())
            contacts_list.append({'id': contact.id, 'group_name': str(contact.group_name),"group_users":group_users,'messages':msg_list})
        representation['contacts'] = contacts_list

        return representation
    
class UsersContactsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersContacts
        fields = '__all__'

    def to_representation(self,instance): 
        representation = super().to_representation(instance)
        representation['contact_mobile'] = ChatUser.objects.get(id=instance.contact_id.id).mobile

        return representation