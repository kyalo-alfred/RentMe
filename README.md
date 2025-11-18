# 🏠 RentMe

**RentMe** is a web-based platform that allows users to **rent out items** they own to others temporarily.  
Users can register, post items, book rentals, make demo payments, and choose mock couriers.  
Admins can manage users and listings through a dashboard.

-----

## ⚙️ Tech Stack

- **Frontend:** React.js (Next.js)
- **Backend:** Django (Python)
- **Database:** PostgreSQL / SQLite (development)

----

## ✨ Main Features

- User registration, login & profile management
- Add, edit, and delete item listings
- Browse, search, and filter items
- Book items with date selection
- Simulated payments & courier options
- Admin dashboard for moderation
- User Module integration with enhanced profile fields

---

## 🗂 Project Structure

```
RentMe/
├── client/          # React frontend (Next.js)
├── server/          # Django backend (API + logic)
│   ├── accounts/    # User authentication & profiles (User Module integrated)
│   ├── logistics_demo/  # Logistics module
│   └── rentme/      # Django project settings
├── users/           # User Module (standalone)
└── templates/       # HTML templates
```

---

## 🚀 Setup

### Backend Setup

```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm start
```

---

## 📡 API Endpoints

### User Authentication (User Module Integrated)
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user (JWT)
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/me/` - Get current user profile
- `PATCH /api/auth/profile/update/` - Update user profile
- `PUT /api/auth/password/change/` - Change password
- `GET /api/auth/users/<id>/` - Get public user profile

### Logistics
- `GET /api/logistics/` - Get logistics endpoints

---

## 👤 User Module

The User Module has been integrated into the `accounts` app with:
- Enhanced user model with profile fields (bio, address, city, country, etc.)
- JWT authentication
- Profile picture upload
- User ratings support
- Public user profiles

For detailed User Module documentation, see `USER_MODULE_README.md` and related documentation files.

---

## 📚 Documentation

- `USER_MODULE_README.md` - User Module overview
- `USER_MODULE_INTEGRATION.md` - Integration guide
- `AUTHENTICATION_GUIDE.md` - Authentication setup
- `TEAM_SETUP_GUIDE.md` - Team setup instructions

---
