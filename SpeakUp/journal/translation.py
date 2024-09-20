from modeltranslation.translator import TranslationOptions, translator
from .models import Article


class ArticleTranslationOptions(TranslationOptions):
    fields = ('title', 'intro', 'body')


translator.register(Article, ArticleTranslationOptions)
