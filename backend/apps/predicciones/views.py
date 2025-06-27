from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.generics import DestroyAPIView
from .utils.deepseek import responder_deepseek

from django.conf import settings
from .models import Prediccion
from .serializers import PrediccionSerializer
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import cv2
import os

# Cargar modelo 
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
    print(f"CLASE: {clase}, CONFIANZA: {confianza}")
    return clase, confianza


def imagen_parecida_a_hoja(path):
    img = cv2.imread(path)
    if img is None:
        print("No se pudo leer la imagen con cv2.imread()")
        return False

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    verde_bajo = (35, 40, 40)
    verde_alto = (85, 255, 255)

    mascara = cv2.inRange(hsv, verde_bajo, verde_alto)
    porcentaje_verde = np.sum(mascara > 0) / (img.shape[0] * img.shape[1])

    print(f'Porcentaje de verde {porcentaje_verde}')
    return porcentaje_verde >= 0.15


class PrediccionAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        imagen = request.FILES.get('imagen')
        if not imagen:
            return Response({'error': 'No se proporcionó ninguna imagen.'}, status=400)

        from tempfile import NamedTemporaryFile

        with NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            for chunk in imagen.chunks():
                tmp_file.write(chunk)
            tmp_path = tmp_file.name

        # Validar si contiene suficiente verde
        if not imagen_parecida_a_hoja(tmp_path):
            return Response({
                "error": "La imagen no parece contener una hoja de maíz. Intenta subir una imagen más clara, real y enfocada."
            }, status=400)

        clase, confianza = predecir(tmp_path)

        # Validar confianza mínima
        if confianza < 0.60:
            return Response({
                "error": "La imagen fue clasificada con baja confianza. Intenta subir una imagen más enfocada o de mejor calidad.",
                "clase_detectada": clase,
                "confianza": round(confianza, 3)
            }, status=400)

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
    

class RecomendacionDeepSeekAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            pred = Prediccion.objects.get(id=pk, usuario=request.user)
        except Prediccion.DoesNotExist:
            return Response({"error": "Predicción no encontrada"}, status=404)

        prompt = f"""
        Soy un agricultor. Un sistema de visión artificial detectó que una hoja de maíz presenta la condición: '{pred.clase}'.
        ¿Podrías darme 3 recomendaciones profesionales para tratarla o prevenirla? Asi mismo mencioname 3 causas que provocaron
        esa condicion. Si esta sana, solo dame 3 recomendaciones para mantenerla en ese estado.
        """
        respuesta = responder_deepseek(prompt)
        return Response({"clase": pred.clase, "recomendacion": respuesta})