# Generated by Django 5.1 on 2024-09-20 01:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0004_alter_article_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='body_en',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='article',
            name='body_uk',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='article',
            name='intro_en',
            field=models.CharField(max_length=450, null=True),
        ),
        migrations.AddField(
            model_name='article',
            name='intro_uk',
            field=models.CharField(max_length=450, null=True),
        ),
        migrations.AddField(
            model_name='article',
            name='title_en',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AddField(
            model_name='article',
            name='title_uk',
            field=models.CharField(max_length=250, null=True),
        ),
    ]
