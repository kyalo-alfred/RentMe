# 🏠 RentMe

**RentMe** is a web-based platform that allows users to **rent out items** they own to others temporarily.  
Users can register, post items, book rentals, make demo payments, and choose mock couriers.  
Admins can manage users and listings through a dashboard.

---

## ⚙️ Tech Stack
- **Frontend:** React.js  
- **Backend:** Django (Python)  
- **Database:** PostgreSQL  

---

## ✨ Main Features
- User registration, login & profile management  
- Add, edit, and delete item listings  
- Browse, search, and filter items  
- Book items with date selection  
- Simulated payments & courier options  
- Admin dashboard for moderation  

---

## 🗂 Project Structure
RentMe/backend/
-Django backend (API + logic)

RentMe/frontend/
-React frontend (UI)

---

## 🚀 Setup
```bash
# Clone repo
git clone https://github.com/kyalo-alfred/RentMe.git
cd RentMe

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py runserver

# Frontend setup
cd ../frontend
npm install
npm start
