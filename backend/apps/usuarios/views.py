from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import RegistroUsuarioSerializer, UsuarioSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

class RegistroUsuarioAPI(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegistroUsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mensaje": "Usuario creado con éxito"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CustomLoginAPI(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username = username, password = password)
        
        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            return Response({
                'access' : access_token,
                'refresh' : str(refresh),
                'username' : user.username,
                'email' : user.email
            })
        else:
            return Response({"detail" : "Credenciales invalidad"}, status=status.HTTP_401_UNAUTHORIZED)
        

class PerfilUsuarioAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
    

class LogoutAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token_obj = RefreshToken(refresh_token)
            token_obj.blacklist()
            return Response({"mensaje": "Sesión cerrada correctamente"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)