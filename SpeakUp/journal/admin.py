from django.contrib import admin
from .models import Article, Category
from django_summernote.admin import SummernoteModelAdmin


class ArticleAdmin(SummernoteModelAdmin):
    readonly_fields = ['views']
    summernote_fields = ('body',)
    prepopulated_fields = {'slug': ('title',)}


admin.site.register(Article, ArticleAdmin)
admin.site.register(Category)
