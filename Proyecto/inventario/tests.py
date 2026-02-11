from django.test import TestCase
from .models import Producto, Servicio, MaterialServicio
from .form import ProductoForm

class InventarioTests(TestCase):
    def test_producto_creacion_activado_por_defecto(self):
        """Verifica que un producto creado con ProductoForm sea activo por defecto"""
        data = {
            'nombre': 'Producto Test',
            'descripcion': 'Descripcion',
            'precio_compra': 10.0,
            'precio_venta': 20.0,
            'cantidad_en_stock': 100,
        }
        form = ProductoForm(data=data)
        self.assertTrue(form.is_valid(), form.errors)
        producto = form.save()
        producto.refresh_from_db()
        self.assertTrue(producto.activo)

    def test_material_servicio_predeterminado(self):
        """Verifica que se pueda marcar un material como predeterminado"""
        servicio = Servicio.objects.create(nombre='Corte', descripcion='Corte pelo', precio=15.0)
        producto = Producto.objects.create(
            nombre='Gel', descripcion='Gel fix', precio_compra=5, precio_venta=10, cantidad_en_stock=10
        )
        material = MaterialServicio.objects.create(servicio=servicio, producto=producto, cantidad=1, es_predeterminado=True)
        self.assertTrue(material.es_predeterminado)
