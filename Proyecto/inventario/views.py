from django.shortcuts import render, redirect
from django.http import HttpResponse
from .form import ProductoForm
from .models import usuario

# Create your views here.

#Autenticacion
def signin(request):
    if request.method == 'POST':
        # Aquí iría la lógica para manejar el formulario de inicio de sesión
        email = request.POST.get('email')
        contraseña = request.POST.get('contraseña')
        try:
            user = usuario.objects.get(email=email, contraseña=contraseña)
            # Lógica para iniciar sesión al usuario
            return redirect('index')  # Redirige a la página principal después del inicio de sesión
        except usuario.DoesNotExist:
            # Manejar el caso en que el usuario no existe o las credenciales son incorrectas
            return render(request, 'pages/login.html', {'error': 'Credenciales inválidas'})
    return render(request, 'pages/login.html' )
def signup(request):
    if request.method == 'POST':
        # Aquí iría la lógica para manejar el formulario de registro
        nombre = request.POST.get('nombre')
        email = request.POST.get('email')
        contraseña = request.POST.get('contraseña')
            # Lógica para crear el usuario en la base de datos
        nuevo_usuario = usuario(nombre=nombre, email=email, contraseña=contraseña)
        nuevo_usuario.save()
        return redirect('signin')  # Redirige al inicio de sesión después del registro
    return render(request, 'pages/register.html' )

#Inicio
def index(request):
    return render(request, 'pages/home.html' )

#Urls Inventario
def productlist(request):
    return render(request, 'pages/inventario.html')

def addproduct(request):
    if request.method == 'POST':
        form = ProductoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('productlist')  # Redirige a la lista de productos después de agregar
    else:
        form = ProductoForm()
    return render(request, 'pages/agregar_producto.html', {'form': form})

#Ventas

def salelist(request):
    return render(request, 'pages/ventas.html' )

def pos(request):
    return render(request, 'pos.html' )

def salesreturnlist(request):
    return render(request, 'salesreturnlist.html' )

def createsalesreturn(request):
    return render(request, 'createsalesreturn.html' )

#Compras

def purchaselist(request):
    return render(request, 'purchaselist.html' )

def addpurchase(request):
    return render(request, 'addpurchase.html' )

def importpurchase(request):
    return render(request, 'importpurchase.html' )

#Expensas

def expenselist(request):
    return render(request,'expenselist.html' )

def addexpense(request):
    return render(request,'addexpense.html' )

def expensecategory(request):
    return render(request,'expensecategory.html' )

def Hello(request):
    return HttpResponse("Hola")

def about(request):
    return HttpResponse("About")

