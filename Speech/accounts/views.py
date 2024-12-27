from django.contrib.auth.models import User
from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import re
from django.contrib.auth import authenticate
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .serializers import LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from google.oauth2 import id_token
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponse, JsonResponse
from speechbrain.pretrained import Tacotron2, HIFIGAN 
import torchaudio
import io


@csrf_exempt
def test_view(request):
    if request.method == 'POST':
        return JsonResponse({'message': 'Requête POST réussie'}, status=200)
    return JsonResponse({'message': 'Utilisez POST'}, status=400)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    data = request.data
    username = data.get('username')
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    password2 = data.get('password2')

    errors = {}

    # Validation des champs
    if not username:
        errors['username'] = 'Le nom d\'utilisateur est obligatoire.'
    elif len(username) < 3:
        errors['username'] = 'Le nom d\'utilisateur doit contenir au moins 3 caractères.'

    if not name:
        errors['name'] = 'Le nom complet est obligatoire.'
    elif len(name) < 2:
        errors['name'] = 'Le nom doit contenir au moins 2 caractères.'

    if not email:
        errors['email'] = 'L\'adresse email est obligatoire.'
    elif not re.match(r'\S+@\S+\.\S+', email):
        errors['email'] = 'Email invalide.'

    if not password:
        errors['password'] = 'Le mot de passe est obligatoire.'
    elif len(password) < 8:
        errors['password'] = 'Le mot de passe doit contenir au moins 8 caractères.'

    if not password2:
        errors['password2'] = 'La confirmation du mot de passe est obligatoire.'
    elif password != password2:
        errors['password2'] = 'Les mots de passe ne correspondent pas.'

    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Vérifier si le nom d'utilisateur ou l'email existe déjà
        if User.objects.filter(username=username).exists():
            errors['username'] = 'Ce nom d\'utilisateur est déjà pris.'
        if User.objects.filter(email=email).exists():
            errors['email'] = 'Cet email est déjà utilisé.'
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        # Création de l'utilisateur
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=name
        )
        user.save()

        # Générer des tokens JWT
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Compte créé avec succès !",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED
        )
    except IntegrityError:
        return Response(
            {"error": "Le nom d'utilisateur ou l'email existe déjà."},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": "Une erreur inattendue est survenue."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


User = get_user_model()

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def google_signup_view(request):
    # Récupérer le token depuis la requête
    token = request.data.get('id_token')  # Changé de 'token' à 'id_token'

    if not token:
        return Response({"error": "Token Google manquant."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Vérifier le token avec Google
        # Utilisez settings.GOOGLE_CLIENT_ID pour une configuration plus flexible
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            settings.GOOGLE_CLIENT_ID  # Assurez-vous de le définir dans settings.py
        )

        # Vérification supplémentaire de l'audience
        if idinfo['aud'] not in [settings.GOOGLE_CLIENT_ID]:
            raise ValueError('Mauvais audience.')

        # Extraire les informations utilisateur
        google_id = idinfo.get('sub')
        email = idinfo.get('email')
        name = idinfo.get('name', '')
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')
        picture = idinfo.get('picture')  # Optionnel

        if not email:
            return Response(
                {"error": "Email manquant dans le token Google."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Vérifier si l'utilisateur existe déjà
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Créer un nouvel utilisateur
            username = email.split('@')[0]
            
            # Gestion des doublons de username
            original_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{original_username}{counter}"
                counter += 1

            # Créer l'utilisateur avec des informations plus complètes
            user = User.objects.create_user(
                username=username,
                email=email,
                password=User.objects.make_random_password(),
                first_name=first_name,
                last_name=last_name
            )

        # Générer des tokens JWT
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Connexion réussie avec Google !",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }
            },
            status=status.HTTP_200_OK
        )

    except ValueError as e:
        # Gestion détaillée des erreurs de token
        return Response(
            {"error": f"Erreur de validation du token Google : {str(e)}"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        # Gestion des exceptions inattendues
        return Response(
            {"error": f"Une erreur inattendue s'est produite : {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    """
    Cette vue gère le processus de login. Elle attend un email et un mot de passe
    pour authentifier l'utilisateur et générer un token d'accès et un token de rafraîchissement.
    """

    def post(self, request):
        # Récupérer les données de la requête
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Authentifier l'utilisateur
        user = authenticate(request, username=email, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Créer les tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Retourner les tokens en réponse
        return Response({
            "access": access_token,
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)
    
    
tacotron2 = Tacotron2.from_hparams(
    source="speechbrain/tts-tacotron2-ljspeech", savedir="C:\\Temp\\tmpdir_tts"
)
hifi_gan = HIFIGAN.from_hparams(
    source="speechbrain/tts-hifigan-ljspeech", savedir="C:\\Temp\\tmpdir_vocoder"
)


class TextToSpeech(APIView):
    def post(self, request):
        # Récupérer le texte à partir de la requête
        text = request.data.get('text', '')
        if not text:
            return JsonResponse({"error": "Le texte est requis"}, status=400)

        # Convertir le texte en spectrogramme
        mel_output, mel_length, alignment = tacotron2.encode_text(text)

        # Convertir le spectrogramme en onde sonore
        waveforms = hifi_gan.decode_batch(mel_output)

        # Sauvegarder l'audio dans un objet BytesIO
        buffer = io.BytesIO()
        torchaudio.save(buffer, waveforms.squeeze(1), 22050, format="wav")  # Format ajouté
        buffer.seek(0)

        # Retourner l'audio dans la réponse HTTP
        return HttpResponse(buffer, content_type="audio/wav")
