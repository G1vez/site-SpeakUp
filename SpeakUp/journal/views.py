from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import PageNumberPagination
from django.utils.translation import get_language
from modeltranslation.utils import fallbacks
from django.db.models import Q
from journal.models import Article, Category
from SpeakUp.settings.base import REST_FRAMEWORK
from journal.api.serializers import (
        ArticleDetailSerializer,
        ArticleListSerializer,
        CategorySerializer
)


PAGE_SIZE = REST_FRAMEWORK.get('PAGE_SIZE')


class CustomPagination(PageNumberPagination):
    page_size = PAGE_SIZE


class ArticleViewSet(ReadOnlyModelViewSet):
    queryset = (
        Article.published
        .select_related('author', 'category')
        .all()
    )
    lookup_field = 'slug'
    filter_backends = [OrderingFilter]
    ordering_fields = ['publish_at',]
    pagination_class = CustomPagination

    def get_queryset(self):
        lang = get_language()

        with fallbacks(False):
            return self.queryset.exclude(
                    Q(**{f"title_{lang}__isnull": True}) |
                    Q(**{f"body_{lang}__isnull": True})
            )

    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer
        elif self.action == 'retrieve':
            return ArticleDetailSerializer
        elif self.action == 'articles_by_tag':
            return ArticleListSerializer
        elif self.action == 'articles_by_category':
            return ArticleListSerializer
        return super().get_serializer_class()

    @action(
        detail=False,
        methods=['get'],
        url_path='by-tag/(?P<tag_slug>[^/.]+)',
        url_name='list-by-tag'
    )
    def articles_by_tag(self, request, tag_slug=None):
        queryset = (
            Article.published
            .filter(tags__slug=tag_slug)
            .select_related('author', 'category')
            .all()
        )
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = self.get_serializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(
        detail=False,
        methods=['get'],
        url_path='by-category/(?P<category_slug>[^/.]+)',
        url_name='list-by-category'
    )
    def articles_by_category(self, request, category_slug=None):
        queryset = (
            Article.published
            .filter(category__slug=category_slug)
            .select_related('author', 'category')
            .all()
        )
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = self.get_serializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        article = self.get_object()

        session = request.session
        view_key = f"viewed_article_{article.id}"

        if not session.get(view_key):
            article.views += 1
            article.save()

            session[view_key] = True

        serializer = self.get_serializer(article)
        return Response(serializer.data)


class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
