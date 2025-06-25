from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegistroUsuarioAPI, PerfilUsuarioAPI, LogoutAPI

urlpatterns = [
    path('registro/', RegistroUsuarioAPI.as_view(), name='registro'),
    path('perfil/', PerfilUsuarioAPI.as_view(), name='perfil'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutAPI.as_view(), name='logout'),
]
