# EchoLearn Virtual Education Platform

A comprehensive web application integrating solutions for virtual education, built with React frontend and Spring Boot backend.

## Project Structure

```
echolearn/
├── backend (Spring Boot)
│   ├── src/main/java/com/core/echolearn/
│   │   ├── entity/          # JPA Entities (User, Assignment, Notification)
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── service/         # Business Logic Services
│   │   ├── controller/      # REST API Controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   └── config/         # Configuration (CORS)
│   └── src/main/resources/
│       └── application.properties
└── frontend/ (React)
    ├── public/
    ├── src/
    │   ├── components/     # Reusable components (Layout)
    │   ├── pages/          # Page components
    │   ├── services/       # API service calls
    │   └── App.js
    └── package.json
```

## Features Implemented

### Authentication & User Management
- ✅ User signup with role selection (Student/Teacher)
- ✅ User login with email or username
- ✅ Session management with localStorage
- ✅ Protected routes

### Dashboard
- ✅ Display user's enrolled classes
- ✅ Class cards with color-coded headers
- ✅ Responsive grid layout

### Assignments
- ✅ List all assignments
- ✅ Filter by status (All, Overdue, Due Today, This Week, Upcoming)
- ✅ Search and sort functionality
- ✅ Difficulty badges (Easy, Medium, Hard)
- ✅ Mark assignments as complete

### Notifications
- ✅ Display all notifications
- ✅ Unread/Total counts
- ✅ Mark individual notifications as read
- ✅ Mark all notifications as read
- ✅ Filter by read/unread status

## Technology Stack

### Backend
- **Spring Boot 3.5.7**
- **Java 17**
- **Spring Data JPA**
- **H2 Database** (in-memory, no external DB required)
- **Maven**

### Frontend
- **React 18.2**
- **React Router 6**
- **Axios** for API calls
- **CSS3** for styling

## Prerequisites

- **Java 17** or higher
- **Node.js 16** or higher
- **Maven** (or use included mvnw wrapper)

## Getting Started

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd echolearn
```

Run the Spring Boot application:
```bash
# Windows
mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

**API Endpoints:**
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/assignments/user/{userId}` - Get user's assignments
- GET `/api/notifications/user/{userId}` - Get user's notifications
- PUT `/api/notifications/{id}/read` - Mark notification as read

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd echolearn/frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Usage

1. **Access the application** at `http://localhost:3000`
2. **Sign Up** as a new user (Student or Teacher)
3. **Sign In** with your credentials
4. **Navigate** through:
   - Dashboard - View your classes
   - Assignments - Manage your assignments
   - Notifications - Check your notifications

## Database

The application uses **H2 in-memory database**, which means:
- ✅ No external database installation required
- ✅ Data is stored in memory during runtime
- ✅ Data resets when application restarts
- ✅ Perfect for development and testing

To access H2 Console (optional):
1. Visit `http://localhost:8080/h2-console`
2. JDBC URL: `jdbc:h2:mem:echolearndb`
3. Username: `sa`
4. Password: (leave empty)

## API Testing

You can test the API using tools like Postman or curl:

**Example - Sign Up:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "username": "student1",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "STUDENT"
  }'
```

**Example - Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "student1",
    "password": "password123"
  }'
```

## Future Enhancements

- Calendar integration
- Real-time chat functionality
- File sharing system
- AI-powered feedback
- Student status monitoring
- MySQL/PostgreSQL integration
- JWT authentication
- WebSocket for real-time updates

## Notes

- The current implementation uses plain text passwords (for development only)
- In production, implement password hashing (BCrypt)
- Add JWT tokens for secure authentication
- Implement proper error handling and validation
- Add unit and integration tests

## Troubleshooting

**Port already in use:**
- Backend: Change port in `application.properties`: `server.port=8081`
- Frontend: Set PORT environment variable: `PORT=3001 npm start`

**CORS errors:**
- Ensure backend is running on port 8080
- Check CORS configuration in `CorsConfig.java`

**Database connection issues:**
- H2 database is in-memory and requires no configuration
- If issues persist, check `application.properties`

## License

This project is for educational purposes.

## Contact

For questions or support, please contact the development team.
