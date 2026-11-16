from django.urls import path
from .views import *

urlpatterns = [
    path('',home),
    path(
        'api/contact/',
        ContactAPIView.as_view(),
        name='contact'
    ),
]