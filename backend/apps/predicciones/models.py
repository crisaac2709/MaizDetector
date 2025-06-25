from django.db import models
from django.contrib.auth.models import User

class Prediccion(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to="imagenes_maiz/")
    clase = models.CharField(max_length=100)
    confianza = models.FloatField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.clase} ({self.confianza:.2f}) - {self.fecha.date()}"
