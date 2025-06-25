from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.generics import DestroyAPIView

from django.conf import settings
from .models import Prediccion
from .serializers import PrediccionSerializer
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import cv2
import os

# Cargar modelo desde la raíz del proyecto
modelo = load_model(os.path.join(settings.BASE_DIR, 'model\MaizDetector.h5'))
CLASES = ["Common_Rust","Gray_Leaf_Spot","Healthy","Blight"]

def predecir(path):
    file_bytes = np.fromfile(path, dtype=np.uint8)  
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (299, 299))
    img = np.expand_dims(img, axis=0) 
    pred = modelo.predict(img)[0]
    clase = CLASES[np.argmax(pred)]
    confianza = float(np.max(pred))
    return clase, confianza



class PrediccionAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        imagen = request.FILES.get('imagen')
        if not imagen:
            return Response({'error': 'No se proporcionó ninguna imagen.'}, status=400)

        # Guardar la imagen temporalmente (en memoria) para predecir
        from tempfile import NamedTemporaryFile
        from django.core.files.uploadedfile import InMemoryUploadedFile

        with NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            for chunk in imagen.chunks():
                tmp_file.write(chunk)
            tmp_path = tmp_file.name

        clase, confianza = predecir(tmp_path)

        # Crear y guardar la predicción FINAL
        instancia = Prediccion(
            imagen=imagen,
            usuario=request.user,
            clase=clase,
            confianza=confianza
        )
        instancia.save()

        serializer = PrediccionSerializer(instancia)
        return Response(serializer.data, status=status.HTTP_201_CREATED)




class MisPrediccionesAPI(ListAPIView):
    serializer_class = PrediccionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Prediccion.objects.filter(usuario=self.request.user).order_by('-fecha')
    

class EliminarPrediccionAPI(DestroyAPIView):
    queryset = Prediccion.objects.all()
    serializer_class = PrediccionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(usuario=self.request.user)