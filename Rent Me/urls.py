"""
URL configuration for User Module (RentMe Project)
This is a minimal configuration for the User Module only.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users import views as users_views

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),
    
    # User Module API endpoints
    path('api/users/', include('users.urls')),
    
    # User Module template views (optional - for testing)
    path('login/', users_views.login_page_view, name='login-page'),
    path('register/', users_views.register_page_view, name='register-page'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
