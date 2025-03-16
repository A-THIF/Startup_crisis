from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .forms import SignUpForm, ContactForm
from .models import UserProfile, Component

def startpage(request):
    return render(request, 'startpage.html')

def contact_view(request):
    form = ContactForm()
    return render(request, 'contact.html', {'form': form})

def selection(request):
    return render(request, 'selection.html')

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')

def settings(request):
    return render(request, 'settings.html')  # Ensure the template path is correct

def gameflow(request):
    components = Component.objects.all()  # Gets all items
    return render(request, 'gameflow.html', {'components': components})

def signout(request):
    return render(request, 'signout.html')

def settings2(request):
    return render(request, 'settings2.html')

def exit_view(request):
    return render(request, 'exit.html')

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            UserProfile.objects.create(
                user=user,
                full_name=form.cleaned_data['full_name'],
                date_of_birth=form.cleaned_data['date_of_birth']
            )
            return redirect('login')
        else:
            return render(request, 'startpage.html', {'signup_error': form.errors, 'form': form})
    return render(request, 'startpage.html')

def user_login(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['pswd']
        try:
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
        except User.DoesNotExist:
            user = None
        if user is not None:
            login(request, user)
            return redirect('selection')
        else:
            return render(request, 'startpage.html', {'login_error': 'Wrong email or password!'})
    return render(request, 'startpage.html')

def selection(request):
    return render(request, 'selection.html')

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')

def settings(request):
    return render(request, 'settings.html')

def gameflow(request):
    components = Component.objects.all()
    return render(request, 'gameflow.html', {'components': components})

def signout(request):
    logout(request)
    return redirect('startpage')

def settings2(request):
    return render(request, 'settings2.html')

def exit_view(request):
    return redirect('startpage')
