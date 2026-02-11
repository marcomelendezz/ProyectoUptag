from django.contrib import admin
from .models import Servicio, MaterialServicio

class MaterialServicioInline(admin.TabularInline):
    model = MaterialServicio
    extra = 1

@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    inlines = [MaterialServicioInline]

@admin.register(MaterialServicio)
class MaterialServicioAdmin(admin.ModelAdmin):
    list_display = ('servicio', 'producto', 'cantidad', 'es_predeterminado')
    list_filter = ('servicio', 'es_predeterminado')
