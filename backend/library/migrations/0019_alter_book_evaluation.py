# Generated by Django 5.2.1 on 2025-05-19 14:21

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('library', '0018_order_is_paid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='evaluation',
            field=models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0.0), django.core.validators.MaxValueValidator(5.0)]),
        ),
    ]
