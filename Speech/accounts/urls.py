from django.urls import path,include
from .views import signup_view,LoginView,google_signup_view,TextToSpeech
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('signup/', signup_view, name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('auth/google/', google_signup_view, name='google_signup'),  
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/tts/', TextToSpeech.as_view(), name='text-to-speech'),

    
]