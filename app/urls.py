from django.urls import path
from .views import *

urlpatterns = [
    path('',home),
    path(
        'contact/',
        ContactAPIView.as_view(),
        name='contact'
    ),
]