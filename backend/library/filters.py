import django_filters

from .models import *

class BookFilter(django_filters.FilterSet):
    class Meta:
        model = Book
        fields = {
            'author_name': ['iexact', 'icontains'],
            'category_id__category_name': ['iexact', 'icontains'],
            'price' : ['exact', 'lt', 'gt', 'range']
        }