from django.shortcuts import render, redirect
from django.contrib.auth import authenticate,logout,login

from chat_api.models import ChatUser
from chat_api.serializers import ChatUserCreationSerializer

# Create your views here.
def user_login(request):
    if request.method == 'POST':
        print(request.method)
        mobile = request.POST['mobile']
        password = request.POST['password']
        print(request.POST)
        user = authenticate(mobile=mobile,password=password)
        print(user)
        if user is not None:
            login(request,user)
            return redirect('/chat/')
        else:
            return render(request,"login.html", context={'error': True , 'error_message' : "Invalid Login Credentials"})
    return render(request,'login.html')

def register(request):
    if request.method == 'POST':
        mobile = request.POST['mobile']
        name = request.POST['name']
        password = request.POST['password']
        print(request.POST)
        user_exists = ChatUser.objects.filter(mobile=mobile).exists()
        if user_exists:
            return render(request,"register.html", context={'error': True , 'error_message' : "User Already Exists"})
        else:
            print(request.POST)
            query_dict_copy = request.POST.copy()
            query_dict_copy.pop('csrfmiddlewaretoken')
            query_dict_copy.pop('password2')
            print(query_dict_copy.dict())
            serializer = ChatUserCreationSerializer(data=query_dict_copy.dict())
            if serializer.is_valid():
                serializer.save()
                return render(request,"register.html", context={'message': True , 'message_content' : "User Successfully Created"})
            else:
                return render(request,"register.html", context={'error': True , 'error_message' : "Failed To Create User"})

    return render(request,'register.html')

def chat(request):
    if request.user.is_authenticated:
        return render(request,'chat.html')
    return render(request,'html_404.html')