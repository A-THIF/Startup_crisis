from django.urls import path

from . import views

urlpatterns = [
    path('', views.startpage, name='startpage'),
    path('contact/', views.contact_view, name='contact'),
    path('selection/', views.selection, name='selection'), 
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('settings/', views.settings, name='settings'),
    path('gameflow/', views.gameflow, name='gameflow'),
    path('signout/', views.signout, name='signout'),
    path('settings2/', views.settings2, name='settings2'),
    path('exit/', views.exit_view, name='exit'),
]