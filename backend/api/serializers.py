from django.db.models import Count, Sum
from rest_framework import serializers

from .models import Word, WordOccurrence, UploadedTextFile


class UploadedTextFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedTextFile
        fields = ['id', 'file', 'file_name', 'uploaded_at']


class UploadedTextFileListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedTextFile
        fields = ['id', 'file', 'file_name', 'uploaded_at']


class WordStatisticsSerializer(serializers.ModelSerializer):
    total_count = serializers.SerializerMethodField()
    file_count = serializers.SerializerMethodField()
    file_percentage = serializers.SerializerMethodField()
    count_in_current_file = serializers.SerializerMethodField()

    class Meta:
        model = Word
        fields = ['text', 'total_count', 'file_count',
                  'file_percentage', 'count_in_current_file']

    def get_total_count(self, obj: Word) -> int:
        return WordOccurrence.objects.filter(word=obj).aggregate(total_count=Sum('count'))['total_count']

    def get_file_count(self, obj: Word) -> int:
        return WordOccurrence.objects.filter(word=obj).values('text_file').distinct().count()

    def get_file_percentage(self, obj: Word) -> float:
        total_files = UploadedTextFile.objects.count()
        if total_files == 0:
            return 0.0
        file_count = self.get_file_count(obj)
        return (file_count / total_files) * 100

    def get_count_in_current_file(self, obj: Word) -> int:
        text_file = self.context.get('text_file')
        if text_file:
            occurrence = WordOccurrence.objects.filter(
                word=obj, text_file=text_file).first()
            if occurrence:
                return occurrence.count
        return 0
