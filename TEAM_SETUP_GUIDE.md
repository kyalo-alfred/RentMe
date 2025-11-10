# RentMe - Team Setup Guide

Welcome to the RentMe project! This guide will help you get the project running on your local machine.

## 📋 Prerequisites

Before you begin, make sure you have installed:
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/downloads/)
- A code editor (VS Code recommended)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/kyalo-alfred/RentMe.git
cd RentMe
```

### 2. Backend Setup (Django)

#### Windows:
```bash
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_couriers
python manage.py runserver
```

#### macOS/Linux:
```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_couriers
python manage.py runserver
```

The backend will be running at: **http://localhost:8000**

### 3. Frontend Setup (Next.js)

Open a **new terminal** window:

```bash
cd client
npm install
npm run dev
```

The frontend will be running at: **http://localhost:3000**

## 🎯 Testing the Application

### Create an Account
1. Go to http://localhost:3000/signup
2. Fill in the registration form
3. You'll be automatically logged in

### Test Authentication
1. Try logging out and back in at http://localhost:3000/signin
2. Visit your profile at http://localhost:3000/profile
3. Edit your profile information
4. Change your password in Settings tab

### Test Courier System
1. Go to http://localhost:3000/checkout
2. Select a courier (Bolt, Glovo, or Uber)
3. Enter pickup and delivery addresses
4. Assign the courier

## 🗄️ Database Information

We're using a **shared PostgreSQL database** hosted on Render:
- **Database**: PostgreSQL (production-ready)
- **Location**: Frankfurt, Germany
- **Credentials**: Already configured in `server/.env`

⚠️ **Important**: Everyone on the team shares the same database. Be careful when:
- Running migrations
- Deleting data
- Making schema changes

## 📁 Project Structure

```
RentMe/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages (Next.js App Router)
│   │   │   ├── signin/    # Login page
│   │   │   ├── signup/    # Registration page
│   │   │   ├── profile/   # User profile page
│   │   │   └── checkout/  # Courier assignment
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # Auth context (global state)
│   │   └── lib/          # API utilities
│   ├── .env.local        # Frontend environment vars
│   └── package.json
│
└── server/                # Django backend
    ├── accounts/          # User authentication
    │   ├── models.py     # Custom User model
    │   ├── views.py      # Auth endpoints
    │   ├── serializers.py
    │   └── urls.py
    ├── logistics_demo/    # Courier management
    │   ├── models.py     # Courier & Assignment models
    │   ├── views.py      # Courier endpoints
    │   └── management/   # Seed command
    ├── rentme/           # Project settings
    │   ├── settings.py   # Django configuration
    │   └── urls.py       # URL routing
    ├── .env              # Backend environment vars
    ├── requirements.txt  # Python dependencies
    └── manage.py
```

## 🔑 Key Features Implemented

### Authentication System (JWT)
- User registration with validation
- Login/logout with JWT tokens
- Token refresh (auto-refresh on expiry)
- Password change functionality
- Profile management

### API Endpoints

#### Authentication (`/api/auth/`)
- `POST /api/auth/register/` - Create new account
- `POST /api/auth/login/` - Login (get JWT tokens)
- `POST /api/auth/token/refresh/` - Refresh access token
- `POST /api/auth/logout/` - Logout (blacklist token)
- `GET /api/auth/me/` - Get current user
- `PUT /api/auth/profile/update/` - Update profile
- `PUT /api/auth/password/change/` - Change password

#### Logistics (`/api/logistics/`)
- `GET /api/logistics/couriers/available/` - List couriers
- `POST /api/logistics/assignments/` - Assign courier
- `GET /api/logistics/assignments/by_booking/` - Get assignment

### Frontend Pages
- `/` - Home page
- `/signup` - User registration
- `/signin` - User login
- `/profile` - User profile (requires auth)
- `/checkout` - Courier assignment (requires auth)
- `/listings` - Browse items (placeholder)
- `/post-items` - Post new items (placeholder)

## 🛠️ Development Workflow

### Starting Development

1. **Always pull latest changes first:**
   ```bash
   git pull origin main
   ```

2. **Start backend** (Terminal 1):
   ```bash
   cd server
   .venv\Scripts\activate  # Windows
   # source .venv/bin/activate  # macOS/Linux
   python manage.py runserver
   ```

3. **Start frontend** (Terminal 2):
   ```bash
   cd client
   npm run dev
   ```

### Making Changes

1. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Test thoroughly**

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

5. **Push to GitHub:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub for team review

### Database Migrations

⚠️ **IMPORTANT**: Coordinate with the team before making migrations!

If you modify models:

1. **Announce in team chat** that you're making a migration
2. **Create migration:**
   ```bash
   python manage.py makemigrations
   ```
3. **Review the migration file**
4. **Apply migration:**
   ```bash
   python manage.py migrate
   ```
5. **Commit the migration file:**
   ```bash
   git add server/*/migrations/
   git commit -m "Add migration for [description]"
   git push
   ```
6. **Notify team** to pull and run `python manage.py migrate`

## 🐛 Troubleshooting

### Backend Issues

**Error: "ModuleNotFoundError: No module named 'django'"**
- Make sure your virtual environment is activated
- Run: `pip install -r requirements.txt`

**Error: "django.db.utils.OperationalError"**
- Database connection issue
- Check if PostgreSQL credentials in `.env` are correct
- Verify internet connection (database is hosted on Render)

**Port already in use:**
```bash
# Find and kill the process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:8000 | xargs kill -9
```

### Frontend Issues

**Error: "Module not found"**
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**Error: "Failed to fetch"**
- Make sure Django backend is running
- Check that backend is on http://localhost:8000
- Clear browser cache (Ctrl+Shift+R)

**Environment variables not loading:**
- Restart Next.js dev server after changing `.env.local`
- Make sure file is named `.env.local` exactly

### CORS Errors
- Check `CORS_ALLOWED_ORIGINS` in `server/rentme/settings.py`
- Ensure both servers are running on correct ports
- Try hard refresh (Ctrl+Shift+R)

## 📚 Useful Documentation

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📝 Additional Resources

Project-specific guides in the repository:
- `AUTHENTICATION_GUIDE.md` - Authentication implementation details
- `PROFILE_PAGE_GUIDE.md` - Profile page features
- `LOGISTICS_MODULE.md` - Courier system explanation
- `HOW_TO_RUN_DEMO.md` - Demo walkthrough

## 🤝 Team Coordination

### Best Practices

1. **Communicate**: Use your team chat for coordinating changes
2. **Pull often**: Run `git pull origin main` before starting work
3. **Small commits**: Make frequent, small commits with clear messages
4. **Test first**: Always test your changes before pushing
5. **Code review**: Review each other's pull requests
6. **Document**: Comment your code and update docs

### Common Git Commands

```bash
# Check status
git status

# See what changed
git diff

# Pull latest changes
git pull origin main

# Create new branch
git checkout -b feature/feature-name

# Switch branches
git checkout main

# See all branches
git branch -a

# Undo uncommitted changes
git checkout -- filename

# View commit history
git log --oneline
```

## 🆘 Getting Help

If you're stuck:
1. Check this guide first
2. Look at existing code examples
3. Search error messages online
4. Ask the team in group chat
5. Check the documentation guides

## ✅ Quick Health Check

Run these to verify everything is working:

### Backend Health:
```bash
# In browser or curl
http://localhost:8000/admin/
http://localhost:8000/api/auth/register/
```

### Frontend Health:
```bash
# In browser
http://localhost:3000
http://localhost:3000/signup
```

### Database Health:
```bash
cd server
python manage.py dbshell
# Should connect to PostgreSQL
# Exit with: \q
```

## 🎉 You're All Set!

If you've completed all steps and can access both the frontend and backend, you're ready to start developing!

Happy coding! 🚀

---

**Last Updated**: November 10, 2025  
**Maintained by**: RentMe Team
