from django.urls import path, include
from rest_framework import routers

from .views import (
    UploadedTextFileView, UploadedTextFileList,
    DownloadFileView,
    WordStatisticsListView,
    ShowDownloadFileView,
)

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),

    path('upload/', UploadedTextFileView.as_view(), name='file-upload'),

    path('download/<int:pk>/', DownloadFileView.as_view(), name='download-file'),

    path('files/', UploadedTextFileList.as_view(), name='files'),
    path('files/<int:pk>/', UploadedTextFileList.as_view(), name='file'),

    path('stats/', WordStatisticsListView.as_view(), name='all-stats'),
    path('stats/<int:pk>/', WordStatisticsListView.as_view(), name='file-stats'),

    path('show/<int:pk>/', ShowDownloadFileView.as_view(), name='show-file'),
]
