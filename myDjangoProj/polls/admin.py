from django.contrib import admin
from .models import Component

@admin.register(Component)
class ComponentAdmin(admin.ModelAdmin):
    list_display = ('name', 'fund')  # Show these in a table
    search_fields = ('name',)        # Add a search box