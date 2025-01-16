from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login, authenticate
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from .forms import ContactForm

def startpage(request):
    return render(request, 'startpage.html')
def contact_view(request):
    form = ContactForm()
    return render(request, 'contact.html', {'form': form})

def selection(request):
    return render(request, 'selection.html')
