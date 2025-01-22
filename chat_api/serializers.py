from rest_framework import serializers

from .models import *




class ChatUserCreationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatUser
        fields = ['mobile','name','password']
        extra_kwargs = {'password':{'write_only':True}} # Field doesnt include the hashed password in the json data

    def create(self, validated_data):
        """
            Method inherent to the ModelSerializers
            is executed on serializers.save()
            to create a record if it doesnot exists and returns the instance
        """
        user = ChatUser.objects.create_user(validated_data['mobile'],validated_data['password'])
        user.name = validated_data['name']
        user.save()
        return user # important to return the instance

class ChatUserLoginSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatUser
        fields = ['mobile','password']
        extra_kwargs = {'password':{'write_only':True}} # Field doesnt include the hashed password in the json data

    def to_representation(self,instance): 
        """
            to_representation():
                ...
            This method helps to customize the json data according to requirements.
        """
        representation = super().to_representation(instance)
        representation['name'] = ChatUser.objects.get(mobile=representation['mobile']).name
        return representation # important to return the instance
    

class ChatUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatUser
        fields = ['id','mobile']
    

class MessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = '__all__'


    def to_representation(self,instance): 
        """
            to_representation():
                ...
            This method helps to customize the json data according to requirements.
        """
        representation = super().to_representation(instance)
        representation['from_user'] = ChatUser.objects.get(id=representation['from_user']).mobile
        representation['to'] = ChatUser.objects.get(id=representation['to']).mobile

        return representation
    
class GroupSerializers(serializers.ModelSerializer):

    class Meta:
        model = ChatGroups
        fields = '__all__'

    def to_representation(self,instance): 
        representation = super().to_representation(instance)
        group_users = list(instance.group_users.all().values('id','mobile'))
        msg_list = MessagesSerializer(Messages.objects.filter(group_name=instance.id),many=True).data
        representation["group_users"] = group_users
        representation['messages'] = msg_list
        return representation
    

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
            msg_list = MessagesSerializer(Messages.objects.filter(group_name=contact.id),many=True).data
            contacts_list.append({'id': contact.id, 'group_name': str(contact.group_name),"group_users":group_users,'messages':msg_list,'last_message_time':contact.last_message_time})
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