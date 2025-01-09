from django.shortcuts import render
from .forms import ContactForm

def startpage(request):
    return render(request, 'startpage.html')

def contact_view(request):
    form = ContactForm()
    return render(request, 'contact.html', {'form': form})