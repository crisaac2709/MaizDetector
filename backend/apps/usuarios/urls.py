from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegistroUsuarioAPI, PerfilUsuarioAPI, LogoutAPI, CustomLoginAPI

urlpatterns = [
    path('registro/', RegistroUsuarioAPI.as_view(), name='registro'),
    path('perfil/', PerfilUsuarioAPI.as_view(), name='perfil'),
    path('login/', CustomLoginAPI.as_view(), name='custom_login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutAPI.as_view(), name='logout'),
]
