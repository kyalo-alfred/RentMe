# How to Run the Logistics Demo

## Prerequisites

- Python 3.8+ installed
- Node.js 18+ installed
- Git installed (for cloning/pushing)

---

## Step 1: Clone/Setup Repository

If you haven't already:
```bash
git clone <https://github.com/kyalo-alfred/RentMe >
cd RentMe
```

---

## Step 2: Backend Setup

### Navigate to server directory
```bash
cd server
```

### Activate Virtual Environment

**Windows:**
```bash
.\venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### Install Dependencies (if not already installed)
```bash
pip install -r requirements.txt
```

### Run Migrations

⚠️ **IMPORTANT - Shared Database Note:**

Since we're using a **shared PostgreSQL database on Render**, the tables may already exist from another team member's setup.

**First time or if you get "relation already exists" errors:**
```bash
python manage.py migrate --fake
```

**If database is empty (fresh setup):**
```bash
python manage.py migrate
```

💡 **Tip:** Use `--fake` to mark migrations as applied without actually running them. This syncs Django's migration tracker with the existing database tables.

### Seed Courier Data
```bash
python manage.py seed_couriers
```

This creates the three courier services (Bolt, Glovo, Uber) in the database.

### Start Django Server
```bash
python manage.py runserver
```

**Backend should now be running at:** http://localhost:8000

---

## Step 3: Frontend Setup

### Open a NEW terminal window (keep backend running)

### Navigate to client directory
```bash
cd client
```

### Install Dependencies (if not already installed)
```bash
npm install
```

### Start Next.js Development Server
```bash
npm run dev
```

**Frontend should now be running at:** http://localhost:3000

---

## Step 4: Access the Demo

### Main Entry Points

1. **Checkout Page (Courier Selection)**
   ```
   http://localhost:3000/checkout?booking_id=demo-123
   ```
   - Replace `demo-123` with any booking ID you want to test

2. **API Endpoints (for testing)**
   ```
   http://localhost:8000/api/logistics/couriers/available/
   ```

3. **Admin Panel**
   ```
   http://localhost:8000/admin/
   ```
   - Requires Django superuser account

---

## Step 5: Test the Demo Flow

### Complete User Journey

1. **Open checkout page**
   - Go to: http://localhost:3000/checkout?booking_id=test-001
   - You should see:
     - Order summary on the left
     - Courier selection dropdown on the right
     - Pickup/delivery address fields (optional)

2. **Select a courier**
   - Click the dropdown
   - Choose one: Bolt, Glovo, or Uber
   - Optionally enter addresses

3. **Confirm assignment**
   - Click "Confirm & Assign Courier" button
   - Wait for API call to complete

4. **View confirmation**
   - You'll be redirected to confirmation page
   - Should see "Courier Assigned!" message
   - Details include: courier name, booking ID, status, timestamp

---

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
python manage.py runserver 8001
```
Then update frontend API URL in `client/src/lib/api.ts`

**Migration errors (DuplicateTable / relation already exists):**

This happens because tables already exist in the shared database.

```bash
# Mark migrations as applied without running them
python manage.py migrate --fake

# Check migration status
python manage.py showmigrations
```

**Other migration errors:**
```bash
python manage.py makemigrations
python manage.py migrate
```

**Couriers not showing:**
```bash
python manage.py seed_couriers
```

### Frontend Issues

**Port 3000 already in use:**
```bash
npm run dev -- -p 3001
```

**API connection errors:**
- Check backend is running on port 8000
- Check CORS settings in `server/rentme/settings.py`
- Verify API URL in `client/src/lib/api.ts`

**Module not found errors:**
```bash
npm install
```

---

## Quick Test Commands

### Test API Endpoints

**Get couriers:**
```bash
curl http://localhost:8000/api/logistics/couriers/available/
```

**Create assignment:**
```bash
curl -X POST http://localhost:8000/api/logistics/assignments/ \
  -H "Content-Type: application/json" \
  -d '{"booking_id":"test-123","courier_id":1}'
```

---

## Common Errors & Solutions

### Error: "relation 'accounts_user' does not exist"

**Cause:** Database is missing the user table (common if someone ran `--fake` on an empty database)

**Solution:**
```bash
# Run the fix script
python fix_accounts_tables.py

# Then create a test user
python create_test_user.py
```

Or manually:
```bash
# Reset migration tracking and reapply
python manage.py migrate accounts zero --fake
python manage.py migrate accounts
```

### Error: "relation 'accounts_user_...' already exists"

**Cause:** Database tables already exist (shared database or previous migration)

**Solution:**
```bash
python manage.py migrate --fake
```

This marks migrations as complete without actually creating tables.

### Error: "Unexpected token '<', "<!DOCTYPE"... is not valid JSON"

**Cause:** Frontend can't connect to backend

**Solution:**
1. Make sure Django is running: `python manage.py runserver`
2. Check `client/.env.local` exists with: `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
3. Restart Next.js dev server: Stop (Ctrl+C) then `npm run dev`
4. Visit http://localhost:8000/api/auth/register/ - should see Django REST Framework page

### Error: Port already in use

**Backend (8000):**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
python manage.py runserver 8001
```

**Frontend (3000):**
```bash
npm run dev -- -p 3001
```

---

## Verification Checklist

Before considering the demo ready:

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Checkout page loads courier dropdown
- [ ] All 3 couriers (Bolt, Glovo, Uber) appear in dropdown
- [ ] Can select a courier and submit
- [ ] Confirmation page shows assignment details
- [ ] No console errors in browser
- [ ] No errors in terminal/console

---

## Stopping the Servers

### Stop Backend
- Press `Ctrl+C` in the backend terminal

### Stop Frontend
- Press `Ctrl+C` in the frontend terminal

---

## Production Deployment Notes

For production, you would need to:

1. **Set up environment variables**
   - `NEXT_PUBLIC_API_URL` for frontend
   - `SECRET_KEY` for Django
   - Database credentials

2. **Enable authentication**
   - Update `permission_classes` in views
   - Add authentication middleware

3. **Configure CORS properly**
   - Update `CORS_ALLOWED_ORIGINS` in settings

4. **Use production database**
   - Update `DATABASES` in settings.py

5. **Build frontend**
   ```bash
   npm run build
   npm start
   ```

---

## Demo Presentation Tips

1. **Start both servers** before presentation
2. **Have a test booking ID ready** (e.g., `demo-123`)
3. **Test the flow once** before showing to audience
4. **Show the dropdown** - emphasize all 3 courier options
5. **Show the confirmation** - highlight the "Courier Assigned!" message
6. **Mention it's a demo** - explain it's simulated for presentation

---

## Support

If you encounter issues:
1. Check both servers are running
2. Check browser console for errors
3. Check terminal/console for backend errors
4. Verify database migrations are applied
5. Verify couriers are seeded
