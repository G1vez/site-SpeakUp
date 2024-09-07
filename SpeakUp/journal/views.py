from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from journal.models import Article
from journal.api.serializers import (
        ArticleDetailSerializer,
        ArticleListSerializer
)


class ArticleViewSet(ReadOnlyModelViewSet):
    queryset = Article.objects.all()
    lookup_field = 'slug'

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
        articles = Article.objects.filter(tags__slug=tag_slug)
        serializer = self.get_serializer(articles, many=True)
        return Response(serializer.data)
