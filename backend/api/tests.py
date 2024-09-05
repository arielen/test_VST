import os
from django.urls import reverse
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile

from rest_framework import status
from rest_framework.test import APIClient

from .models import UploadedTextFile, WordOccurrence, Word


class FileTestMixin:
    def _create_test_file(self, file_name, content) -> SimpleUploadedFile:
        return SimpleUploadedFile(file_name, content, content_type="text/plain")

    def _remove_file(self, file_path) -> None:
        if os.path.exists(file_path):
            os.remove(file_path)


class UploadedTextFileViewTest(TestCase, FileTestMixin):
    def setUp(self) -> None:
        self.client = APIClient()
        self.upload_url = reverse('file-upload')
        self.test_file = self._create_test_file("test_file.txt", b"This is a test file. Test file content here.")

    def tearDown(self) -> None:
        uploaded_file_path = self._get_uploaded_file_path()
        self._remove_file(uploaded_file_path)

    def _get_uploaded_file_path(self) -> str:
        return os.path.join(os.getcwd(), 'uploaded_texts', os.path.basename(self.test_file.name))

    def test_file_upload_success(self) -> None:
        response = self.client.post(self.upload_url, data={'file': self.test_file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)

    def test_file_upload_no_file(self) -> None:
        response = self.client.post(self.upload_url, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('No file provided', response.data['error'])


class WordStatisticsListViewTest(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.file = UploadedTextFile.objects.create(file_name="test.txt")
        self.word1 = Word.objects.create(text="test")
        self.word2 = Word.objects.create(text="file")
        WordOccurrence.objects.create(text_file=self.file, word=self.word1, count=3)
        WordOccurrence.objects.create(text_file=self.file, word=self.word2, count=2)
        self.word_stats_url = reverse('file-stats', kwargs={'pk': self.file.pk})

    def test_get_word_statistics(self) -> None:
        response = self.client.get(self.word_stats_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)


class DownloadFileViewTest(TestCase, FileTestMixin):
    def setUp(self) -> None:
        self.client = APIClient()
        self.file = UploadedTextFile.objects.create(
            file_name="test_download.txt",
            file=self._create_test_file("test_download.txt", b"Download test content.")
        )
        self.download_url = reverse('download-file', kwargs={'pk': self.file.pk})

    def tearDown(self) -> None:
        self._remove_file(self.file.file.path)

    def test_download_file_success(self) -> None:
        response = self.client.get(self.download_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Disposition'], f'attachment; filename={self.file.file_name}')

    def test_download_file_not_found(self) -> None:
        response = self.client.get(reverse('download-file', kwargs={'pk': 999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ShowDownloadFileViewTest(TestCase, FileTestMixin):
    def setUp(self) -> None:
        self.client = APIClient()
        self.file = UploadedTextFile.objects.create(
            file_name="test_show.txt", 
            file=self._create_test_file("test_show.txt", b"Inline show test content.")
        )
        self.show_url = reverse('show-file', kwargs={'pk': self.file.pk})

    def tearDown(self) -> None:
        self._remove_file(self.file.file.path)

    def test_show_file_success(self) -> None:
        response = self.client.get(self.show_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Disposition'], f'inline; filename={self.file.file_name}')

    def test_show_file_not_found(self) -> None:
        response = self.client.get(reverse('show-file', kwargs={'pk': 999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
