# Generated by Django 3.1.4 on 2021-02-17 22:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jsnake', '0003_score_difficulty'),
    ]

    operations = [
        migrations.AlterField(
            model_name='score',
            name='difficulty',
            field=models.CharField(default='', max_length=4),
        ),
    ]
