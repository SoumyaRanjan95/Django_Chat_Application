from django.shortcuts import render, redirect
from django.contrib.auth import authenticate,logout,login

from chat_api.models import ChatUser
from chat_api.serializers import ChatUserCreationSerializer

# View for the Login Page
def user_login(request):
    if request.method == 'POST':
        mobile = request.POST['mobile']
        password = request.POST['password']
        user = authenticate(mobile=mobile,password=password)
        if user is not None:
            login(request,user)
            # Redirects to the 'chat/' URL after successful authentication
            return redirect('/chat/')
        else:
            # If Error authenticating then return an error message along with webpage
            return render(request,"login.html", context={'error': True , 'error_message' : "Invalid Login Credentials"})
        
    # Renders just the login.html page for GET request
    return render(request,'login.html')

# View for the Register Page
def register(request):
    if request.method == 'POST':
        mobile = request.POST['mobile']
        name = request.POST['name']
        password = request.POST['password']

        # Check if a user already exists
        user_exists = ChatUser.objects.filter(mobile=mobile).exists()
        if user_exists:
            # If user exists then return error message
            return render(request,"register.html", context={'error': True , 'error_message' : "User Already Exists"})
        else:
            query_dict_copy = request.POST.copy() # Query dict object in request.POST is immutable cannot pop objects, to do so copy first
            query_dict_copy.pop('csrfmiddlewaretoken')
            query_dict_copy.pop('password2')
            serializer = ChatUserCreationSerializer(data=query_dict_copy.dict()) # Serialize the objects to python types
            if serializer.is_valid():
                # Save the data from the serializer to the database
                serializer.save()

                # Return the webpage with a context message
                return render(request,"register.html", context={'message': True , 'message_content' : "User Successfully Created"})
            else:
                # If Error authenticating then return an error message along with webpage
                return render(request,"register.html", context={'error': True , 'error_message' : "Failed To Create User"})

    # Renders just the register.html page for GET request
    return render(request,'register.html')

#View for Chat Page
def chat(request):
    # Only render the page if the user is authenticated else 404 Not Found Page
    if request.user.is_authenticated:
        return render(request,'chat.html')
    return render(request,'html_404.html')