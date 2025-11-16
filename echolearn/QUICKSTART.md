# 🚀 Quick Start Guide - EchoLearn

## Step-by-Step Instructions

### Step 1: Start the Backend (Spring Boot)

1. Open a terminal in VS Code
2. Navigate to the backend directory:
   ```powershell
   cd echolearn
   ```

3. Run the Spring Boot application:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

4. Wait for the message: "Started EcholearnApplication"
5. Backend is now running at `http://localhost:8080`

### Step 2: Start the Frontend (React)

1. Open a **NEW** terminal in VS Code (keep backend running)
2. Navigate to the frontend directory:
   ```powershell
   cd echolearn\frontend
   ```

3. Install dependencies (first time only):
   ```powershell
   npm install
   ```

4. Start the React development server:
   ```powershell
   npm start
   ```

5. Your browser should automatically open `http://localhost:3000`

### Step 3: Test the Application

1. **Sign Up**
   - Click "Sign Up" button
   - Select "Student" 
   - Fill in:
     - Email: test@example.com
     - Username: testuser
     - Password: password123
     - Confirm Password: password123
   - Click "Sign In" button (yes, it says Sign In but it's for signup)

2. **View Dashboard**
   - You should see the dashboard with 9 sample classes
   - Each class card shows course code, name, and teacher

3. **Check Assignments**
   - Click "Assignment" in the sidebar
   - See 3 sample assignments
   - Try filtering by "All", "Overdue", "Due Today", etc.
   - Click "Mark Complete" to mark an assignment as done

4. **View Notifications**
   - Click "Notifications" in the sidebar
   - See unread notifications count
   - Click "Mark as Read" on individual notifications
   - Try "Mark All as Read" button

## Common Issues & Solutions

### Issue: Port 8080 already in use
**Solution:** Stop any other Java applications or change the port in `application.properties`

### Issue: Port 3000 already in use
**Solution:** 
```powershell
$env:PORT=3001; npm start
```

### Issue: "mvnw.cmd not found"
**Solution:** Make sure you're in the `echolearn` directory (not `frontend`)

### Issue: Backend starts but shows errors
**Solution:** Check if Java 17 is installed:
```powershell
java -version
```

### Issue: Frontend shows "Cannot connect to backend"
**Solution:** 
1. Make sure backend is running on port 8080
2. Check console for CORS errors
3. Verify API URL in `frontend/src/services/api.js`

## What's Working Now

✅ **Authentication**
- Sign up with email, username, password
- Login with email or username
- Role selection (Student/Teacher)
- Session persistence with localStorage

✅ **Dashboard**
- Display 9 sample classes
- Color-coded class cards
- Responsive grid layout

✅ **Assignments**
- List assignments with details
- Filter by status (All, Overdue, Due Today, This Week, Upcoming)
- Search functionality
- Difficulty badges
- Mark complete functionality

✅ **Notifications**
- Display all notifications
- Unread/Total counters
- Mark as read (individual and all)
- Filter by unread/all
- Timestamp display

## Testing the API Directly

You can test the backend API without the frontend:

### Sign Up
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signup" -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@example.com","username":"testuser","password":"pass123","confirmPassword":"pass123","role":"STUDENT"}'
```

### Login
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"emailOrUsername":"testuser","password":"pass123"}'
```

## Next Development Steps

1. **Connect to Real Database** (MySQL)
   - Update `application.properties`
   - Add MySQL dependency
   - Create database schema

2. **Implement Security**
   - Add password hashing (BCrypt)
   - Implement JWT tokens
   - Add authentication filters

3. **Add More Features**
   - Calendar page
   - Class details
   - Assignment submission
   - File upload
   - Real-time chat

4. **Improve UI/UX**
   - Add loading states
   - Better error messages
   - Toast notifications
   - Animations

## Need Help?

- Check the main README.md for detailed documentation
- Review the API endpoints in the controllers
- Check browser console for frontend errors
- Check terminal for backend errors

---

Happy coding! 🎓
