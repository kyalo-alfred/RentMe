from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    RegisterView,
    UserDetailView,
    UpdateProfileView,
    ChangePasswordView,
    logout_view,
    PublicUserProfileView,
)

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logout_view, name='logout'),

    # User profile endpoints
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('profile/update/', UpdateProfileView.as_view(), name='update_profile'),
    path('password/change/', ChangePasswordView.as_view(), name='change_password'),
    
    # Public user profile endpoint
    path('users/<int:id>/', PublicUserProfileView.as_view(), name='public_user_profile'),
]
