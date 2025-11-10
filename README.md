# 👤 User Module - RentMe Project

## Overview

This is the **User Module** for the RentMe peer-to-peer rental platform. It provides complete user authentication, registration, login/logout, and profile management functionality using Django and Django REST Framework.

**Developer:** Member 1  
**Module:** User Module (Backend - Django + DB)  
**Responsibilities:** Authentication, registration, login/logout, profile editing

---

## 🎯 Features

- ✅ User Registration
- ✅ User Login/Logout
- ✅ User Profile Management
- ✅ Password Change
- ✅ Profile Picture Upload
- ✅ Session-based Authentication
- ✅ REST API Endpoints
- ✅ Django Admin Integration
- ✅ Public User Profiles
- ✅ User Ratings Support

---

## 📦 Project Structure

```
user-module/
├── users/                      # User Module Django app
│   ├── models.py              # User model
│   ├── serializers.py         # API serializers
│   ├── views.py               # API views
│   ├── urls.py                # URL routing
│   ├── admin.py               # Admin configuration
│   └── migrations/            # Database migrations
├── rentme/                    # Django project settings
│   ├── settings.py            # Django settings
│   ├── urls.py                # Main URL configuration
│   └── wsgi.py                # WSGI configuration
├── templates/                 # HTML templates (optional)
│   └── users/
│       ├── login.html
│       └── register.html
├── media/                     # Media files (profile pictures)
│   └── profile_pictures/
├── requirements.txt           # Python dependencies
└── manage.py                  # Django management script
```

---

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd user-module

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

```bash
# Create migrations
python manage.py makemigrations users

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 3. Run Server

```bash
# Start development server
python manage.py runserver
```

### 4. Test API

```bash
# Test registration
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpass123",
    "password2": "testpass123"
  }'
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login user
- `POST /api/users/logout/` - Logout user

### Profile
- `GET /api/users/profile/` - Get user profile
- `PATCH /api/users/profile/update/` - Update user profile
- `PUT /api/users/change-password/` - Change password
- `GET /api/users/<id>/` - Get public user profile

For detailed API documentation, see `USER_MODULE_API_DOCUMENTATION.md`.

---

## 🔗 Integration with Main Project

This module is designed to be integrated into the main RentMe project. See the integration documentation for details:

- **Quick Start:** `QUICK_START_INTEGRATION.md`
- **Complete Guide:** `USER_MODULE_INTEGRATION.md`
- **Integration Checklist:** `INTEGRATION_CHECKLIST.md`
- **API Documentation:** `USER_MODULE_API_DOCUMENTATION.md`

### Key Integration Points

1. **Settings Configuration:**
   - Add `'users'` to `INSTALLED_APPS`
   - Set `AUTH_USER_MODEL = 'users.User'`
   - Configure REST Framework settings
   - Configure CORS settings

2. **URL Configuration:**
   - Include `path('api/users/', include('users.urls'))` in main `urls.py`

3. **Database:**
   - Run migrations: `python manage.py makemigrations users && python manage.py migrate`

4. **Other Modules:**
   - Use `settings.AUTH_USER_MODEL` for ForeignKey relationships
   - Example: `owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)`

---

## 📋 Requirements

### Python Packages
- Django>=5.2.8
- djangorestframework>=3.16.1
- django-cors-headers>=4.9.0
- Pillow>=12.0.0

### Django Settings
- `AUTH_USER_MODEL = 'users.User'` (required)
- `INSTALLED_APPS` must include 'users', 'rest_framework', 'corsheaders'

---

## 🗄️ Database

### User Model Fields
- `id` - Primary key
- `email` - Email address (unique, used for login)
- `username` - Username (unique)
- `password` - Hashed password
- `first_name`, `last_name` - Name fields
- `phone_number` - Phone number
- `profile_picture` - Profile picture
- `bio` - Biography
- `address`, `city`, `country`, `postal_code` - Address fields
- `rating` - User rating (0.00-5.00)
- `total_ratings` - Total number of ratings
- `is_verified` - Verification status
- `date_joined` - Account creation date
- `updated_at` - Last update timestamp

---

## 🔒 Security

- Session-based authentication
- Password hashing (PBKDF2)
- CSRF protection
- Session timeout (24 hours)
- Email format validation
- Password strength requirements
- File upload size limits (5MB)

---

## 🧪 Testing

### Test User Registration
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpass123",
    "password2": "testpass123"
  }'
```

### Test User Login
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Test Get Profile
```bash
curl -X GET http://localhost:8000/api/users/profile/ \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

---

## 📚 Documentation

### Integration Documentation
- `USER_MODULE_README.md` - Module overview
- `QUICK_START_INTEGRATION.md` - Quick integration guide
- `USER_MODULE_INTEGRATION.md` - Complete integration guide
- `INTEGRATION_CHECKLIST.md` - Integration checklist
- `USER_MODULE_API_DOCUMENTATION.md` - API documentation
- `USER_MODULE_STRUCTURE.md` - File structure
- `USER_MODULE_PACKAGE_SUMMARY.md` - Package summary

---

## 🆘 Support

### Common Issues
See "Common Issues & Solutions" in `USER_MODULE_INTEGRATION.md`

### Getting Help
1. Check documentation files
2. Review error messages
3. Verify settings configuration
4. Contact Member 1 (User Module developer)

---

## ✅ Integration Checklist

- [ ] Users app copied to main project
- [ ] Settings configured
- [ ] URLs configured
- [ ] Dependencies installed
- [ ] Migrations run
- [ ] Superuser created
- [ ] API tested
- [ ] Integration with other modules tested

See `INTEGRATION_CHECKLIST.md` for complete checklist.

---

## 📞 Contact

**Developer:** Member 1 (User Module)  
**Module Version:** 1.0.0  
**Last Updated:** 2024-01-01

---

## 📄 License

This module is part of the RentMe project and follows the project's license.

---

**Ready for integration into the main RentMe project! 🚀**

