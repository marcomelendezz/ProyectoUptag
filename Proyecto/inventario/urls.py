from django.urls import path
from . import views

urlpatterns = [
    path("signin/", views.signin, name = "signin"),
    path("signup/", views.signup, name = "signup"),
    path("", views.index, name = "index"),
    #Urls Inventario
    path("productlist/", views.productlist, name = "productlist"),
    path("addproduct/", views.addproduct, name = "addproduct"),
    
    #Urls Ventas
    path("saleslist/", views.salelist, name = "saleslist"),
    path("pos/", views.pos, name = "pos"),
    path("newsale/", views.pos, name = "newsale"),
    path("salereturnlist/", views.salesreturnlist, name = "salesreturnlist"),
    path("createsalesreturn/", views.createsalesreturn, name = "createsalesreturn"),
    #Urls Compras
    path("purchaselist/", views.purchaselist, name = "purchaselist"),
    path("addpurchase/", views.addpurchase, name = "addpurchase"),
    path("importpurchase/", views.importpurchase, name = "importpurchase"),
    #clientes
    path("clientlist/", views.clientlist, name = "clientlist"),
    path("addclient/", views.addclient, name = "addclient"),

    #Urls Perfil
    path("profile/", views.profile, name = "profile"),
]