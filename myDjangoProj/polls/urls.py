from django.urls import path

from . import views
urlpatterns = [
    path('',views.startpage,name= 'startpage'),
    path('contact/', views.contact_view, name='contact'),
]