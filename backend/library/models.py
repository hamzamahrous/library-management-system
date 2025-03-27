# accounts/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # first_name = models.CharField(max_length=100)
    # last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)


    # Add custom fields here, if needed

    def __str__(self):
        return self.username