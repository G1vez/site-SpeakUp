from django.test import TestCase

from journal.models import Article


class ArticleTests(TestCase):

    fixtures = [
            'journal/tests/fixtures/authors.json',
            'journal/tests/fixtures/categories.json',
            'journal/tests/fixtures/articles.json'
     ]


    def test_article_count(self):

        # Перевірка кількості статей з фікстури

        article_count = Article.objects.count()

        self.assertEqual(article_count, 20)

    def test_article_content(self):

        # Перевірка контенту статті

        article = Article.objects.get(pk=1)

        self.assertEqual(article.title, "Стаття 1")
