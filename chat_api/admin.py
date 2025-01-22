from django.contrib import admin
from django.contrib.auth.admin import UserAdmin


from .forms import *
from .models import *

"""
    User Admin class is used to customize the Admin Panel for the particular Django model
    add the customized admin class along with the Django Model
    e.g.,
    admin.site.register(Model, ModelAdmin)
"""

class ChatUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = ChatUser
    list_display = ("mobile", "is_staff", "is_active",)
    list_filter = ("mobile", "is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("mobile", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "mobile", "password1", "password2", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
        ),
    )
    search_fields = ("mobile",)
    ordering = ("mobile",)


# Register your models here.
admin.site.register(ChatUser,ChatUserAdmin)
admin.site.register(Contacts)
admin.site.register(Messages)
admin.site.register(ChatGroups)
admin.site.register(UsersContacts)
