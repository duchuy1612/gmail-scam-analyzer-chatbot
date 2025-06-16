# Gmail Scam Analyzer Chatbot

An AI-powered email security platform that analyzes emails for potential scams and phishing attempts. The system combines a modern web interface with advanced AI detection capabilities and interactive chat assistance.

## 🏗️ Architecture

This project consists of three main components:

- **Frontend** (Next.js + TypeScript) - Modern web interface with email analysis and chat features
- **Backend** (NestJS + TypeScript) - RESTful API server with comprehensive Swagger documentation
- **AI Service** (FastAPI + Python) - Machine learning service for email analysis and chat responses

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies  
   cd ../backend && npm install
   
   # Install AI service dependencies

   cd ../ai_service && pip install -r requirements.txt
   ```

   > **Note**: Run `npm ci` inside the `backend/` directory before executing
   > `npm run build` or any backend tests. This ensures dependencies exactly
   > match the lock file. If the Nest CLI isn't available globally, use
   > `npx nest build` in your scripts.

2. **Start all services:**
   ```bash
   # Terminal 1: Start AI Service (Port 8000)
   cd ai_service && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Terminal 2: Start Backend API (Port 3001)  
   cd backend && npm run start:dev
   
   # Terminal 3: Start Frontend (Port 3000)
   cd frontend && npm run dev
   ```

3. **Verify services are running:**
   ```bash
   ./test-services.sh
   ```

### Environment Variables
Create a `.env` file inside the `backend` folder with at least the following values:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=appuser
DB_PASSWORD=apppassword
DB_DATABASE=gmail_scam_analyzer
JWT_SECRET=your-jwt-secret-key
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_REDIRECT_URI=http://localhost:3001/oauth2callback
```

### Gmail API Setup
1. Enable the Gmail API in your Google Cloud project.
2. Create OAuth credentials and copy the client ID, secret and redirect URI into the `.env` file above.
3. When calling `/emails/import-gmail`, provide an OAuth access token for the authenticated Gmail user.

## 📱 Application Features

### 🛡️ Email Analysis
- **Real-time Scam Detection**: Upload emails for instant AI-powered analysis
- **Risk Assessment**: Get probability scores and risk levels (LOW/MEDIUM/HIGH/CRITICAL)
- **Red Flag Identification**: Detailed breakdown of suspicious elements
- **Batch Processing**: Analyze multiple emails simultaneously

### 💬 AI Chat Assistant  
- **Interactive Guidance**: Ask questions about email security
- **Contextual Responses**: Smart suggestions based on conversation
- **Educational Content**: Learn about phishing tactics and prevention
- **Sample Analysis**: Pre-loaded suspicious emails for testing

### 📊 System Monitoring
- **Health Dashboard**: Monitor all service statuses
- **API Documentation**: Interactive Swagger/OpenAPI docs
- **Real-time Metrics**: Service uptime and performance indicators

## 🔗 Service Endpoints

### Frontend (Port 3000)
- **Main App**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Chat Interface**: http://localhost:3000/chat

### Backend API (Port 3001)
- **Health Check**: http://localhost:3001/health
- **Swagger Docs**: http://localhost:3001/api/docs
- **Email Analysis**: POST /emails/analyze
- **Chat Messages**: POST /chat/message
- **Authentication**: POST /auth/login, /auth/register, /auth/refresh, GET /auth/me

### AI Service (Port 8000)
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs
- **Email Analysis**: POST /analyze-email
- **Bulk Analysis**: POST /bulk-analyze-emails
- **Chat AI**: POST /chat

Refresh tokens allow the frontend to obtain new JWTs without requiring the user to log in again. Use `/auth/refresh` with the stored `refreshToken` and call `/auth/me` to validate credentials on startup.

## 🔧 API Integration

### Email Analysis Example
```bash
curl -X POST http://localhost:3001/emails/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "URGENT: Account Verification Required",
    "body": "Click here to verify your account immediately...",
    "sender": "security@suspicious-domain.com",
    "recipient": "user@example.com"
  }'
```

### Chat Example
```bash
curl -X POST http://localhost:3001/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Is this email suspicious?",
    "sessionId": "session_123"
  }'
```

## 🛠️ Development

### Project Structure
```
├── frontend/           # Next.js web application
│   ├── src/components/ # React components
│   ├── src/lib/       # API client and utilities
│   └── src/contexts/  # React contexts (Auth, etc.)
├── backend/           # NestJS API server  
│   ├── src/controllers/ # API route handlers
│   ├── src/services/   # Business logic and AI integration
│   └── src/dto/       # Data transfer objects
├── ai_service/        # FastAPI ML service
│   └── app/           # AI models and endpoints
└── infrastructure/    # Docker and deployment configs
```

### Technology Stack

**Frontend:**
- Next.js 15 with TypeScript
- React Hooks and Context API
- CSS Modules for styling
- Custom API client with error handling

**Backend:** 
- NestJS with TypeScript
- Swagger/OpenAPI documentation
- Class-validator for request validation
- Modular architecture with services and controllers

**AI Service:**
- FastAPI with Python 3.12
- Pydantic for data validation
- Uvicorn ASGI server
- Extensible ML model architecture

## 📋 Available Scripts

### Frontend
```bash
npm run dev     # Start development server
npm run build   # Build for production  
npm run start   # Start production server
```

### Backend
```bash
npm run start:dev  # Start with hot reload
npm run build     # Compile TypeScript
npm run start     # Start production server
```

### AI Service
```bash
uvicorn app.main:app --reload  # Development with hot reload
uvicorn app.main:app --host 0.0.0.0 --port 8000  # Production
```

## 🔍 Testing the Integration

1. **Access the Dashboard**: http://localhost:3000/dashboard
2. **Try Email Analysis**: Use the "Email Analyzer" tab to test suspicious emails
3. **Chat with AI**: Use the "AI Chat" tab to ask security questions
4. **Check System Health**: Use the "System Health" tab to monitor services
5. **View API Docs**: Access Swagger documentation for both backend and AI service

## 📄 API Documentation

Complete API documentation is available at:
- **Backend API**: http://localhost:3001/api/docs
- **AI Service**: http://localhost:8000/docs

Both services provide interactive Swagger UI for testing endpoints directly from the browser.
