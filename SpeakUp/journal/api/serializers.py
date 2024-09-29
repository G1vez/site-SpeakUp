from django.urls import reverse
from rest_framework import serializers
from journal.models import Article, Category
from taggit.models import Tag
from taggit.serializers import TaggitSerializer


class TagDictSerializer(serializers.ModelSerializer):
    articles_url = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = ['name', 'articles_url']

    def get_articles_url(self, obj):
        requset = self.context.get('request')
        if requset is None:
            return None
        relative_url = reverse('article-list-by-tag', kwargs={'tag_slug': obj.slug})
        return requset.build_absolute_uri(relative_url)


class ArticleListSerializer(serializers.ModelSerializer):
    detail_url = serializers.HyperlinkedIdentityField(
            view_name='article-detail',
            lookup_field='slug'
    )

    class Meta:
        model = Article
        fields = [
                'title',
                'image_url',
                'intro',
                'views',
                'publish_at',
                'detail_url',
        ]


class ArticleDetailSerializer(TaggitSerializer, serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    tags = TagDictSerializer(many=True)

    class Meta:
        model = Article
        fields = [
                'title',
                'image_url',
                'author_name',
                'category_name',
                'body',
                'tags',
                'views',
                'publish_at',
        ]

    def get_author_name(self, obj):
        return f"{obj.author.last_name} {obj.author.first_name}"

    def get_category_name(self, obj):
        return obj.category.name


class CategorySerializer(serializers.ModelSerializer):
    articles_url = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['name', 'slug', 'articles_url']

    def get_articles_url(self, obj):
        requset = self.context.get('request')
        if requset is None:
            return None
        relative_url = reverse(
            'article-list-by-category',
            kwargs={'category_slug': obj.slug}
        )
        return requset.build_absolute_uri(relative_url)
