# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-12 22:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_auto_20160312_2219'),
    ]

    operations = [
        migrations.AlterField(
            model_name='voyage',
            name='time_ended',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
