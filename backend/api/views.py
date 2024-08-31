import re

from django.http import FileResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.exceptions import NotFound

from drf_spectacular.utils import extend_schema

from .models import UploadedTextFile, WordOccurrence, Word
from .serializers import (
    UploadedTextFileSerializer, UploadedTextFileListSerializer,
    WordStatisticsSerializer
)

from collections import Counter
from typing import Dict, List


@extend_schema(
    tags=['Uploaded Text Files'],
)
class UploadedTextFileView(GenericAPIView):
    parser_classes = (MultiPartParser, FormParser, )

    def post(self, request, *args, **kwargs) -> Response:
        file = request.FILES.get('file')

        if not file:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = UploadedTextFileSerializer(
            data={'file': file, 'file_name': file.name}
        )

        if serializer.is_valid():
            serializer.save()
            self.process_file(serializer.instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def process_file(self, text_file: UploadedTextFile) -> None:
        file_path = text_file.file.path

        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read().lower()
            words = re.findall(r'\b\w+\b', text)

            word_counts = Counter(words)

            WordOccurrence.objects.bulk_create(
                [
                    WordOccurrence(
                        text_file=text_file,
                        word=Word.objects.get_or_create(text=word)[0],
                        count=count
                    )
                    for word, count in word_counts.items()
                ]
            )


@extend_schema(
    tags=['Word Statistics'],
)
class WordStatisticsListView(ListAPIView):
    serializer_class = WordStatisticsSerializer

    def get_queryset(self) -> List[Word]:
        """
        Retrieves the queryset for the API endpoint. If a pk is provided, the
        queryset is filtered by the file with that pk. If no pk is provided,
        the queryset is for all files.
        """
        pk = self.kwargs.get('pk')
        self.text_file = None

        if pk:
            try:
                self.text_file = UploadedTextFile.objects.get(pk=pk)
            except UploadedTextFile.DoesNotExist:
                raise NotFound(f"No file found with id {pk}")

            return Word.objects.filter(occurrences__text_file=self.text_file).distinct()

        return Word.objects.all()

    def get_serializer_context(self) -> Dict:
        """
        Generates the context for the serializer. The context includes the
        text_file, which is None if no pk was provided.
        """
        context = super().get_serializer_context()
        context['text_file'] = self.text_file
        return context


@extend_schema(
    tags=['Uploaded Text Files'],
)
class UploadedTextFileList(ListAPIView):
    """
    API endpoint for retrieving a list of uploaded text files or a single
    uploaded text file.

    If a pk is provided, the API endpoint will return a single uploaded text
    file with that pk. Otherwise, the API endpoint will return a list of all
    uploaded text files.
    """
    serializer_class = UploadedTextFileListSerializer

    def get_queryset(self) -> List[UploadedTextFile]:
        """
        Retrieves the queryset for the API endpoint. If a pk is provided, the
        queryset is filtered by the file with that pk. If no pk is provided,
        the queryset is for all files.
        """
        pk = self.kwargs.get('pk')

        if pk:
            return UploadedTextFile.objects.filter(id=pk)

        return UploadedTextFile.objects.all()


@extend_schema(
    tags=['Download Files'],
)
class DownloadFileView(APIView):
    """
    API endpoint for downloading a single uploaded text file.

    If a pk is provided, the API endpoint will return the file with that pk.
    Otherwise, the API endpoint will return a 400 Bad Request response.
    """

    def get(self, request, pk=None, format=None) -> Response:
        """
        Handles GET requests to the API endpoint.

        If a pk is provided, the API endpoint will return the file with that
        pk. Otherwise, the API endpoint will return a 400 Bad Request response.
        """
        if pk:
            text_file = UploadedTextFile.objects.get(pk=pk)
            file = open(text_file.file.path, 'rb')
            response = FileResponse(file)
            response['Content-Disposition'] = f'attachment; filename={
                text_file.file_name}'
            return response
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=['Download Files'],
)
class ShowDownloadFileView(APIView):
    """
    API endpoint for showing a single uploaded text file.

    If a pk is provided, the API endpoint will return the file with that pk.
    Otherwise, the API endpoint will return a 400 Bad Request response.
    """

    def get(self, request, pk=None, format=None) -> Response:
        if pk:
            text_file = UploadedTextFile.objects.get(pk=pk)
            response = FileResponse(text_file.file.open('rb'))
            response['Content-Disposition'] = f'inline; filename={
                text_file.file_name}'
            return response
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
