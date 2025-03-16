from django import forms
from django.contrib.auth.models import User
from .models import UserProfile

class SignUpForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, label="Password")
    confirm_password = forms.CharField(widget=forms.PasswordInput, label="Confirm Password")
    full_name = forms.CharField(max_length=255, label="Full Name")
    date_of_birth = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}), label="Date of Birth")

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def clean(self):  # Check if passwords match
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        if password and confirm_password and password != confirm_password:
            raise forms.ValidationError("Passwords don't match!")
        return cleaned_data

class ContactForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    message = forms.CharField(widget=forms.Textarea)