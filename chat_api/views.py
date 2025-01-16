from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.contrib.auth import login, logout, authenticate




from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication,SessionAuthentication
from rest_framework.authtoken.models import Token




from .models import *
from .serializers import *


# Create your views here.

#@method_decorator(ensure_csrf_cookie, name='dispatch')
class IsAuthenticatedView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = (TokenAuthentication,SessionAuthentication)

    def get(self, request):
        user = ChatUser.objects.get(mobile=request.user)
        if user.is_authenticated:
            return Response({"authenticated":user.is_authenticated,'mobile':user.mobile,'name':user.name})
        else:
            return Response({'authenticated':'False','mobile':'None','name':'Anonymous'})
    
class ChatUserCreationView(APIView):
    serializer_class = ChatUserCreationSerializer
    permission_classes = [permissions.AllowAny]

        
    def post(self, request, format=None):
        serializer = ChatUserCreationSerializer(data=request.data)
        if serializer.is_valid():
            #serializer.validated_data["password"] = make_password(serializer.validated_data["password"]) # serializer create and update not hasing passwords
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ChatUserLoginView(APIView): # Write custom authentication or use the Token/Session authentication

    serializer_class = ChatUserLoginSerializer
    permission_classes =  [permissions.AllowAny]
    #authentication_classes = (SessionAuthentication,)

    def post(self, request, format=None):
        user = authenticate(mobile=request.data["mobile"],password=(request.data["password"]))
        if user:
            login(request, user)
            serializer=ChatUserLoginSerializer(user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({**serializer.data,'token':token.key},status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST) 

class LogoutView(APIView):

    serializer_classes = None
    def get(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
