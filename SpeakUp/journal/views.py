from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from journal.models import Article
from journal.api.serializers import (
        ArticleDetailSerializer,
        ArticleListSerializer
)


class ArticleViewSet(ReadOnlyModelViewSet):
    queryset = (
        Article.objects
        .select_related('author', 'category')
        .prefetch_related('tags')
        .all()
    )
    lookup_field = 'slug'
    filter_backends = [OrderingFilter]
    ordering_fields = ['publish_at',]

    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer
        elif self.action == 'retrieve':
            return ArticleDetailSerializer
        elif self.action == 'articles_by_tag':
            return ArticleListSerializer
        return super().get_serializer_class()

    @action(
            detail=False,
            methods=['get'],
            url_path='by-tag/(?P<tag_slug>[^/.]+)',
            url_name='list-by-tag'
            )
    def articles_by_tag(self, request, tag_slug=None):
        articles = (
            Article.objects
            .filter(tags__slug=tag_slug)
            .select_related('author', 'category')
            .prefetch_related('tags')
        )
        serializer = self.get_serializer(articles, many=True)
        return Response(serializer.data)

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
