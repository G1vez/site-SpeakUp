from modeltranslation.translator import TranslationOptions, translator
from .models import Article, Category


class ArticleTranslationOptions(TranslationOptions):
    fields = ('title', 'intro', 'body')


class CategoryTranslationOptions(TranslationOptions):
    fields = ('name',)


translator.register(Article, ArticleTranslationOptions)
translator.register(Category, CategoryTranslationOptions)
