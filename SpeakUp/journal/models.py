from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from taggit.managers import TaggableManager


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)

    def __str__(self):
        return self.name


class Article(models.Model):

    class Status(models.TextChoices):
        DRAFT = 'DF', 'Draft'
        PUBLISHED = 'PB', 'Published'

    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=250, unique=True)
    image_url = models.URLField(null=True)
    author = models.ForeignKey(
            settings.AUTH_USER_MODEL,
            on_delete=models.CASCADE,
            related_name='author_articles'
    )
    intro = models.CharField(max_length=450)
    body = models.TextField()
    category = models.ForeignKey(
            Category,
            on_delete=models.CASCADE,
            related_name='articles'
    )
    tags = TaggableManager()
    publish_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
            max_length=2,
            choices=Status,
            default=Status.DRAFT
    )

    class Meta:
        ordering = ['-publish_at']
        indexes = [
                models.Index(fields=['-publish_at']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
