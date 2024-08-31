from django.db import models


def get_upload_path(instance: 'UploadedTextFile', filename: str) -> str:
    return f'uploaded_texts/{filename}'


class UploadedTextFile(models.Model):
    file = models.FileField(blank=False, null=False, upload_to=get_upload_path)
    file_name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name


class Word(models.Model):
    text = models.CharField(max_length=255, unique=True)


class WordOccurrence(models.Model):
    text_file = models.ForeignKey(
        UploadedTextFile,
        on_delete=models.CASCADE,
        related_name='word_occurrences'
    )
    word = models.ForeignKey(
        Word,
        on_delete=models.CASCADE,
        related_name='occurrences'
    )
    count = models.PositiveIntegerField()

    class Meta:
        unique_together = ('text_file', 'word')
