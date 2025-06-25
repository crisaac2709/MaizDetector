from django.urls import path
from .views import PrediccionAPI, MisPrediccionesAPI, EliminarPrediccionAPI

urlpatterns = [
    path('predecir/', PrediccionAPI.as_view(), name='predecir'),
    path('mias/', MisPrediccionesAPI.as_view(), name='mis_predicciones'),
    path('eliminar/<int:pk>/', EliminarPrediccionAPI.as_view()),

]
