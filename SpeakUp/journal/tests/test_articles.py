from django.test import TestCase
from rest_framework import status
from django.urls import reverse
from journal.models import Article
from SpeakUp.settings import REST_FRAMEWORK


PAGE_SIZE = REST_FRAMEWORK.get('PAGE_SIZE')


class ArticleTests(TestCase):

    def setUp(self):
        self.article_count = 20

    fixtures = [
            'journal/tests/fixtures/authors.json',
            'journal/tests/fixtures/categories.json',
            'journal/tests/fixtures/articles.json'
     ]

    def test_article_count(self):

        # Перевірка кількості статей з фікстури

        article_count = Article.objects.count()

        self.assertEqual(article_count, self.article_count)

    def test_article_content(self):

        # Перевірка контенту статті

        article = Article.objects.get(pk=1)

        self.assertEqual(article.title, "Стаття 1")

    def test_article_pagination(self):
        url = reverse('article-list')

        # Відправляємо запит на першу сторінку
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Перевіряємо кількість статтей на першій сторінці
        self.assertEqual(len(response.data['results']), PAGE_SIZE)

        # Перевіряємо загальну кількість статей у пагінації
        self.assertEqual(response.data['count'], self.article_count)

        # Перевірка наявності другої сторінки
        self.assertIsNotNone(response.data['next'])

        response = self.client.get(response.data['next'])

        # Перевірка, що залишилось 5 статтей
        self.assertEqual(len(response.data['results']), 5)

        # Перевірка, що остання сторінка порожня
        self.assertIsNone(response.data['next'])
