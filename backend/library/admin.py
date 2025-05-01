from django.contrib import admin

# Register your models here.

from .models import *

admin.site.register(User)
admin.site.register(Book)
admin.site.register(Order)
admin.site.register(Payment)
admin.site.register(Transaction)
admin.site.register(Category)
admin.site.register(Wishlist)
admin.site.register(Review)