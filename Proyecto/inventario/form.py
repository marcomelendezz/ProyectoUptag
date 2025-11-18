from django import forms


class ProductoForm(forms.ModelForm):
    class Meta:
        from .models import Producto
        model = Producto
        fields = "__all__"


class RegisterForm(forms.Form):
       class Meta:
           from .models import usuario
           model = usuario
           fields = "__all__"