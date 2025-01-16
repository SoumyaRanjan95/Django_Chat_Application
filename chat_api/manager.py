from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _

class ChatUserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, mobile , password, **kwargs):
        if not mobile:
            raise ValueError("Mobile No is required")
        if not password:
            raise ValueError("Password is Required")
        user = self.model(mobile=mobile,**kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, mobile, password, **kwargs):

        user = self.create_user(mobile, password, **kwargs)
        user.is_staff= True
        user.is_superuser= True
        user.is_active= True
        user.save(using=self._db)
        return user
