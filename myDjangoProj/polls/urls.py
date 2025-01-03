from django.urls import path

from . import views
urlpatterns = [
    path('start_page',views.startpage,name= 'startpage'),
]