from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .form import ProductoForm
from .models import usuario
from .models import Producto
from django.contrib.auth.models import User

# Create your views here.

#Autenticacion
def signin(request):
    if request.method == 'POST':
        # Aquí iría la lógica para manejar el formulario de inicio de sesión
        user = authenticate(
            request, 
            username=request.POST.get('email'), 
            password=request.POST.get('contraseña'))
        # Si la petición es AJAX (fetch/jQuery), devolver JSON
        is_ajax = request.headers.get('x-requested-with') == 'XMLHttpRequest'
        if user is None:
            if is_ajax:
                return JsonResponse({'success': False, 'errors': 'Credenciales inválidas'})
            return render(request, 'pages/Login.html', {'error': 'Credenciales inválidas'})

        # Usuario válido
        login(request, user)
        if is_ajax:
            return JsonResponse({'success': True, 'redirect': '/'})
        return redirect('/')  # Redirige a la página principal después del inicio de sesión
        
    return render(request, 'pages/Login.html' )
def signup(request):
    if request.method == 'POST':
        # Aquí iría la lógica para manejar el formulario de registro
        nombre = request.POST.get('nombre')
        email = request.POST.get('email')
        contraseña = request.POST.get('contraseña')
            # Lógica para crear el usuario en la base de datos
        # Evitar usuarios duplicados por email
        is_ajax = request.headers.get('x-requested-with') == 'XMLHttpRequest'
        if User.objects.filter(username=email).exists():
            # Si existe, devolver error
            if is_ajax:
                return JsonResponse({'success': False, 'errors': 'Usuario ya registrado con ese correo.'})
            return render(request, 'pages/register.html', {'error': 'Usuario ya registrado con ese correo.'})

        # Crear un User de Django (para poder usar authenticate/login después)
        user = User(username= nombre, email=email)
        # Guardar el nombre en first_name para mostrarlo en la plantilla
        user.first_name = nombre or ''
        user.set_password(contraseña)
        user.save()

        # Guardar en modelo local `usuario` (opcional). Guardamos contraseña hasheada.
        from django.contrib.auth.hashers import make_password
        nuevo_usuario = usuario(nombre=nombre, email=email, contraseña=make_password(contraseña))
        nuevo_usuario.save()

        if is_ajax:
            return JsonResponse({'success': True, 'redirect': '/signin/'})

        return redirect('signin')  # Redirige al inicio de sesión después del registro
    return render(request, 'pages/register.html' )

#Inicio
def index(request):
    return render(request, 'pages/home.html' )

#Urls Inventario
def productlist(request):
    productos = Producto.objects.all()
    return render(request, 'pages/inventario.html' , {'productos': productos} )

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

#Urls Perfil

def profile(request):
    # Mostrar y actualizar el perfil del usuario autenticado
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect('signin')

        nombre = request.POST.get('nombre','').strip()
        email = request.POST.get('email','').strip()
        password = request.POST.get('password','').strip()

        user = request.user
        # Guardar el email antiguo para localizar el registro local `usuario`
        old_email = user.email
        # Verificar si el email está en uso por otro usuario
        if email and user.username != email and User.objects.filter(username=email).exclude(pk=user.pk).exists():
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'errors': 'El correo ya está en uso por otro usuario.'})
            messages.error(request, 'El correo ya está en uso por otro usuario.')
            return redirect('profile')

        # Actualizar campos
        if nombre:
            user.first_name = nombre
        if email:
            user.username = email
            user.email = email
        if password:
            user.set_password(password)
        user.save()

        # Actualizar modelo local `usuario` si existe
        try:
            # Buscar por el email antiguo; si no existe, intentar con el email nuevo
            u = usuario.objects.filter(email=old_email).first()
            if not u:
                u = usuario.objects.filter(email=user.email).first()
            if u:
                u.nombre = user.first_name
                if password:
                    from django.contrib.auth.hashers import make_password
                    u.contraseña = make_password(password)
                u.email = user.email
                u.save()
        except Exception:
            pass

        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'success': True, 'message': 'Perfil actualizado'})

        messages.success(request, 'Perfil actualizado correctamente')
        return redirect('profile')

    return render(request,'pages/perfil.html' )


def signout(request):
    """Cerrar sesión del usuario y redirigir al signin."""
    logout(request)
    # Si es AJAX, devolver JSON
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'success': True, 'redirect': '/signin/'})
    return redirect('signin')

def Hello(request):
    return HttpResponse("Hola")

def about(request):
    return HttpResponse("About")

