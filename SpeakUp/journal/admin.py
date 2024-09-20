from django.contrib import admin
from .models import Article, Category
from django_summernote.admin import SummernoteModelAdmin
from modeltranslation.admin import TranslationAdmin


class ArticleAdmin(SummernoteModelAdmin, TranslationAdmin):
    fieldsets = (
            ('Article data', {
                'fields': [
                    'title',
                    'slug',
                    'image_url',
                    'intro',
                    'body',
                    'author',
                    'category',
                    'tags'
                 ]
            }),
            ('Publication', {
                'classes': ('collapse',),
                'fields': ('publish_at', 'status'),
            }),
            ('Stats', {
                'classes': ('collapse',),
                'fields': ('views', 'created_at', 'updated_at'),
            }),
    )
    readonly_fields = ['views', 'created_at', 'updated_at']
    summernote_fields = ('body',)
    prepopulated_fields = {'slug': ('title',)}


admin.site.register(Article, ArticleAdmin)
admin.site.register(Category)
