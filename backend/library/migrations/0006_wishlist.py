# Generated by Django 5.2 on 2025-04-11 11:50

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('library', '0005_book_publishing_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='Wishlist',
            fields=[
                ('wishlist_id', models.AutoField(primary_key=True, serialize=False)),
                ('added_at', models.DateTimeField(auto_now_add=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='wishlisted_by', to='library.book')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='wishlist_items', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
