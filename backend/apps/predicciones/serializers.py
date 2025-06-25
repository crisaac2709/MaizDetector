from rest_framework import serializers
from .models import Prediccion

class PrediccionSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(use_url=True)
    
    class Meta:
        model = Prediccion
        fields = ['id', 'usuario', 'imagen', 'clase', 'confianza', 'fecha']
        read_only_fields = ['usuario', 'clase', 'confianza', 'fecha']
