# Authentication System

## Overview

The ScamMail AI application now includes a complete authentication system with user registration, login, and protected routes.

## Features

### Backend Authentication
- **User Registration**: Create new accounts with email, password, and name
- **User Login**: Authenticate with email and password
- **JWT Tokens**: Secure token-based authentication with 24-hour expiration
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Email format and password length validation
- **Duplicate Prevention**: Prevents registration with existing emails

### Frontend Authentication
- **Login/Register Forms**: Clean, user-friendly authentication forms
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Auth Context**: Global authentication state management
- **Persistent Sessions**: Token storage in localStorage
- **Error Handling**: User-friendly error messages

## API Endpoints

### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "expiresAt": "2025-06-11T08:13:41.707Z"
}
```

### POST /auth/login
Authenticate an existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "expiresAt": "2025-06-11T08:13:41.707Z"
}
```

### POST /auth/refresh
Refresh an access token (placeholder - requires implementation).

## Frontend Pages

### /auth
Login and registration page with toggle between modes.

### /dashboard (Protected)
Main dashboard with email analyzer, AI chat, and system health.

### /chat (Protected)
Dedicated AI chat interface.

## Components

### AuthContext
Provides authentication state and methods throughout the application:
- `user`: Current user object or null
- `isAuthenticated`: Boolean authentication status
- `isLoading`: Loading state
- `login(email, password)`: Login method
- `register(email, password, name)`: Registration method
- `logout()`: Logout method
- `error`: Current error message
- `clearError()`: Clear error method

### ProtectedRoute
Wrapper component that redirects unauthenticated users to /auth.

### Header
Navigation component with user menu and logout functionality.

## Usage

1. **Start the application:**
   ```bash
   # Backend
   cd backend && npm run start:dev
   
   # Frontend  
   cd frontend && npm run dev
   ```

2. **Access the application:**
   - Home: http://localhost:3002
   - Auth: http://localhost:3002/auth
   - Dashboard: http://localhost:3002/dashboard (requires login)

3. **Test authentication:**
   ```bash
   ./test-auth.sh
   ```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Signed tokens with expiration
- **Input Validation**: Server-side validation with class-validator
- **Error Handling**: Proper HTTP status codes and error messages
- **Protected Routes**: Client-side route protection

## Future Enhancements

- Email verification
- Password reset functionality
- OAuth integration (Google, GitHub)
- Role-based access control
- Session management improvements
- Multi-factor authentication
